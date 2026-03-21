import { Router } from 'express';
import CartController from '../controllers/CartController.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { isUser } from '../middleware/role.middleware.js';

const router = Router();
const cartController = new CartController();


router.use(authenticateJWT, isUser);

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    await cartController.addProduct(req, res);
});

// Ver carrito
router.get('/:cid', async (req, res) => {
    await cartController.getCart(req, res);
});

// Comprar carrito (genera ticket)
router.post('/:cid/purchase', async (req, res) => {
    await cartController.purchaseCart(req, res);
});

export default router;