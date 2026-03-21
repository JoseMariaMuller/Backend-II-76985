import BaseDao from './BaseDao.js';
import { CartModel } from '../models/cart.model.js';
import mongoose from 'mongoose'; 


export default class CartDao extends BaseDao {
    constructor() {
        super(CartModel);
    }

    async findByIdWithProducts(cartId) {
        return await this.model
            .findById(cartId)
            .populate('products.product')
            .lean();
    }

    async addProduct(cartId, productId, quantity = 1) {
    
        const cart = await this.model.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const existingItem = cart.products?.find(
            p => p?.product?.toString() === productId
        );

        if (existingItem) {
            
            await this.model.updateOne(
                { 
                    _id: cartId, 
                    'products.product': productId 
                },
                { 
                    $inc: { 'products.$.quantity': quantity },
                    $set: { updatedAt: new Date() }
                }
            );
        } else {
            
            await this.model.updateOne(
                { _id: cartId },
                { 
                    $push: { 
                        products: { 
                            product: productId, 
                            quantity: quantity 
                        } 
                    },
                    $set: { updatedAt: new Date() }
                }
            );
        }

        
        return await this.model
            .findById(cartId)
            .populate('products.product')
            .lean();
    }


    async removeProduct(cartId, productId) {
        return await this.model.findByIdAndUpdate(
            cartId,
            { 
                $pull: { products: { product: productId } },
                $set: { updatedAt: new Date() }
            },
            { returnDocument: "after" }
        ).lean();
    }

/**
 * @param {string} cartId 
 * @param {Array<string|ObjectId>} productIds - 
 */
async clearProducts(cartId, productIds = []) {
    if (productIds.length > 0) {
        
        const objectIds = productIds.map(id => 
            id instanceof mongoose.Types.ObjectId ? id : new mongoose.Types.ObjectId(id)
        );
        
        return await this.model.findByIdAndUpdate(
            cartId,
            {
                $pull: { products: { product: { $in: objectIds } } },
                $set: { updatedAt: new Date() }
            },
            { returnDocument: "after" }
        ).lean();
    } else {
        // Vaciar todo el carrito
        return await this.model.findByIdAndUpdate(
            cartId,
            { products: [], updatedAt: new Date() },
            { returnDocument: "after" }
        ).lean();
    }
}

    async getCartWithDetails(cartId) {
        return await this.model
            .findById(cartId)
            .populate({
                path: 'products.product',
                select: 'title price stock status'
            })
            .lean();
    }


async clearPurchasedProducts(cartId, purchasedProductIds = []) {
    if (purchasedProductIds.length === 0) {
        return await this.clearProducts(cartId, []);
    }
    
    const objectIds = purchasedProductIds.map(id => 
        typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
    );
    
    return await this.clearProducts(cartId, objectIds);
}

}