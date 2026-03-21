import CartRepository from '../repository/CartRepository.js';

const cartRepository = new CartRepository();

export default class CartController {
    
    async addProduct(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity = 1 } = req.body;
            
            
            if (req.user.cart?.toString() !== cid) {
                return res.status(403).json({ 
                    status: 'error', 
                    error: 'No puedes modificar este carrito' 
                });
            }
            
            const cart = await cartRepository.addProduct(cid, pid, quantity);
            
            res.json({
                status: 'success',
                message: 'Producto agregado al carrito',
                payload: cart
            });
        } catch (error) {
            console.error('Error en addProduct:', error.message);
            
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
            }
            if (error.message === 'Sin stock') {
                return res.status(400).json({ status: 'error', error: 'Sin stock disponible' });
            }
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }

   
    async getCart(req, res) {
        try {
            const { cid } = req.params;
            
            // Verificar propiedad del carrito
            if (req.user.cart?.toString() !== cid) {
                return res.status(403).json({ 
                    status: 'error', 
                    error: 'No puedes acceder a este carrito' 
                });
            }
            
            const cart = await cartRepository.getById(cid);
            
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
            }
            
            res.json({
                status: 'success',
                payload: cart
            });
        } catch (error) {
            console.error('Error en getCart:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }

    
    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            
            // Verificar propiedad
            if (req.user.cart?.toString() !== cid) {
                return res.status(403).json({ 
                    status: 'error', 
                    error: 'No puedes comprar este carrito' 
                });
            }
            
            const result = await cartRepository.purchaseCart(cid, req.user.email);
            
            res.json({
                status: 'success',
                message: result.summary.status === 'completed' 
                    ? 'Compra realizada exitosamente' 
                    : 'Compra parcial - algunos productos no pudieron procesarse',
                payload: {
                    ticket: result.ticket,
                    summary: result.summary
                }
            });
        } catch (error) {
            console.error('Error en purchaseCart:', error.message);
            
            if (error.message === 'El carrito está vacío') {
                return res.status(400).json({ status: 'error', error: 'El carrito está vacío' });
            }
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }
}