import ProductRepository from '../repository/ProductRepository.js';
import ProductDTO from '../dto/ProductDTO.js';

const productRepository = new ProductRepository();

export default class ProductController {
    
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10, category, available } = req.query;
            
            const filters = {};
            if (category) filters.category = category;
            if (available !== undefined) filters.status = available === 'true' ? 'active' : 'inactive';
            
            const products = await productRepository.findAll(filters, {
                page: parseInt(page),
                limit: parseInt(limit)
            });
            
            
            const productsDTO = products.docs?.map(ProductDTO.toPublic) || products.map(ProductDTO.toPublic);
            
            res.json({
                status: 'success',
                payload: productsDTO,
                totalPages: products.totalPages,
                page: products.page
            });
        } catch (error) {
            console.error('Error en getAll products:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }

    async getById(req, res) {
        try {
            const { pid } = req.params;
            const product = await productRepository.getById(pid);
            
            if (!product) {
                return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
            }
            
            res.json({
                status: 'success',
                payload: ProductDTO.toPublic(product)
            });
        } catch (error) {
            console.error('Error en getById product:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }

    
    async create(req, res) {
        try {
            
            const productData = {
                ...req.body,
                owner: req.user.email 
            };
            
            const product = await productRepository.create(productData);
            
            res.status(201).json({
                status: 'success',
                message: 'Producto creado exitosamente',
                payload: ProductDTO.toPublic(product)
            });
        } catch (error) {
            console.error('Error en create product:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }

    
    async update(req, res) {
        try {
            const { pid } = req.params;
            const updateData = req.body;
            
            const product = await productRepository.update(pid, updateData);
            
            if (!product) {
                return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
            }
            
            res.json({
                status: 'success',
                message: 'Producto actualizado exitosamente',
                payload: ProductDTO.toPublic(product)
            });
        } catch (error) {
            console.error('Error en update product:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }

    
    async delete(req, res) {
        try {
            const { pid } = req.params;
            
            const deleted = await productRepository.delete(pid);
            
            if (!deleted) {
                return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
            }
            
            res.json({
                status: 'success',
                message: 'Producto eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error en delete product:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }
}