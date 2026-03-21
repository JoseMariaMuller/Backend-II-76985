import CartDao from '../dao/CartDao.js';
import ProductRepository from './ProductRepository.js';
import TicketRepository from './TicketRepository.js';

export default class CartRepository {
    constructor() {
        this.dao = new CartDao();
        this.productRepo = new ProductRepository();
        this.ticketRepo = new TicketRepository();
    }

    async getById(cartId) {
        return await this.dao.findByIdWithProducts(cartId);
    }

    async addProduct(cartId, productId, quantity = 1) {
        // Verificar que el carrito existe
        const cart = await this.dao.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        // Verificar que el producto existe y tiene stock
        const product = await this.productRepo.getById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        
        if (product.stock < quantity) {
            throw new Error(`Sin stock suficiente. Disponible: ${product.stock}`);
        }
        
        if (product.status !== 'active') {
            throw new Error('Producto no disponible');
        }

        return await this.dao.addProduct(cartId, productId, quantity);
    }

    
    async removeProduct(cartId, productId) {
        return await this.dao.removeProduct(cartId, productId);
    }


    async clearCart(cartId) {
        return await this.dao.clearProducts(cartId, []);
    }

    
    async purchaseCart(cartId, userEmail) {
        
        const cart = await this.dao.findByIdWithProducts(cartId);
        if (!cart || !cart.products || cart.products.length === 0) {
            throw new Error('El carrito está vacío');
        }

        const purchasedProducts = [];
        const failedProducts = [];
        let totalAmount = 0;

        
        for (const item of cart.products) {
            
            const productId = item.product?._id?.toString() || item.product?.toString() || item.product;
            
            const product = await this.productRepo.getById(productId);
            
           
            if (!product) {
                failedProducts.push({ 
                    product: productId, 
                    reason: 'Producto no encontrado' 
                });
                continue;
            }
            
            if (product.stock < item.quantity) {
                failedProducts.push({ 
                    product: productId, 
                    reason: `Stock insuficiente. Disponible: ${product.stock}` 
                });
                continue;
            }
            
            if (product.status !== 'active') {
                failedProducts.push({ 
                    product: productId, 
                    reason: 'Producto no disponible' 
                });
                continue;
            }

            
            const subtotal = product.price * item.quantity;
            await this.productRepo.dao.updateById(product._id, {
                stock: product.stock - item.quantity
            });

            purchasedProducts.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
                subtotal
            });
            
            totalAmount += subtotal;
        }

        
        let status = 'completed';
        if (failedProducts.length > 0 && purchasedProducts.length === 0) {
            status = 'failed';
        } else if (failedProducts.length > 0) {
            status = 'partial';
        }

        
        const ticket = await this.ticketRepo.dao.create({
            purchaser: userEmail,
            amount: totalAmount,
            products: purchasedProducts,
            failed_products: failedProducts,
            status
        });

        
        if (purchasedProducts.length > 0) {
            await this.dao.clearPurchasedProducts(
                cartId, 
                purchasedProducts.map(p => p.product.toString())
            );
        }

        return {
            ticket,
            summary: {
                total: totalAmount,
                purchased: purchasedProducts.length,
                failed: failedProducts.length,
                status
            }
        };
    }
}