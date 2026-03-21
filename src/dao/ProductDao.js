import BaseDao from './BaseDao.js';
import { ProductModel } from '../models/product.model.js';

export default class ProductDao extends BaseDao {  
    constructor() {
        super(ProductModel);
    }
    
    async findByCategory(category) {
        return await this.model.find({ category, status: 'active' }).lean();
    }
}