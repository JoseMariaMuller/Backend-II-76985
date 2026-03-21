import { Router } from 'express';
import ProductController from '../controllers/ProductController.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { isAdmin, isUser } from '../middleware/role.middleware.js';

const router = Router();
const productController = new ProductController();

// 👉 RUTAS PÚBLICAS 
router.get('/', async (req, res) => {
    await productController.getAll(req, res);
});

router.get('/:pid', async (req, res) => {
    await productController.getById(req, res);
});

// 👉 RUTAS SOLO ADMIN 
router.post('/', 
    authenticateJWT,  
    isAdmin,          
    async (req, res) => {
        await productController.create(req, res);
    }
);

router.put('/:pid', 
    authenticateJWT, 
    isAdmin, 
    async (req, res) => {
        await productController.update(req, res);
    }
);

router.delete('/:pid', 
    authenticateJWT, 
    isAdmin, 
    async (req, res) => {
        await productController.delete(req, res);
    }
);

export default router;