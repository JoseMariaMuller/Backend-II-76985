import ProductDao from '../dao/ProductDao.js';

export default class ProductRepository {
    constructor() {
        this.dao = new ProductDao();
    }


async findAll(filters = {}, options = {}) {
    return await this.dao.findAll(filters, { lean: true });
}

    async getById(id) {
        return await this.dao.findById(id);
    }

    async create(productData) {
        
        if (!productData.title || !productData.price || !productData.category) {
            throw new Error('Title, price y category son requeridos');
        }
        
        if (productData.price <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }
        
        if (productData.stock < 0) {
            throw new Error('El stock no puede ser negativo');
        }

        
        const data = {
            ...productData,
            status: productData.status || 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return await this.dao.create(data);
    }

    async update(id, updateData) {
        
        const protectedFields = ['_id', 'createdAt', 'owner'];
        protectedFields.forEach(field => delete updateData[field]);
        
        updateData.updatedAt = new Date();
        
        return await this.dao.updateById(id, updateData);
    }

    async delete(id) {
        
        return await this.dao.updateById(id, { 
            status: 'inactive',
            updatedAt: new Date()
        });
    }

    async updateStock(productId, quantity) {
        const product = await this.dao.findById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        
        if (product.stock < quantity) {
            throw new Error('Sin stock suficiente');
        }
        
        return await this.dao.updateById(productId, {
            stock: product.stock - quantity,
            updatedAt: new Date()
        });
    }

    async findByCategory(category, options = {}) {
        return await this.dao.findAll({ category, status: 'active' }, options);
    }

    async findAvailable(options = {}) {
        return await this.dao.findAll({ status: 'active', stock: { $gt: 0 } }, options);
    }
}