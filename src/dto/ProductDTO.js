export default class ProductDTO {
    /**
     
     * @param {Object} product 
     * @returns {Object} 
     */
    static toPublic(product) {
        if (!product) return null;
        
       
        const productObj = typeof product.toObject === 'function' 
            ? product.toObject() 
            : product;

        return {
            id: productObj._id,
            title: productObj.title,
            description: productObj.description,
            price: productObj.price,
            category: productObj.category,
            stock: productObj.stock,
            status: productObj.status,
            thumbnail: productObj.thumbnail,
            
        };
    }

    
    static toAdmin(product) {
        if (!product) return null;
        
        const productObj = typeof product.toObject === 'function' 
            ? product.toObject() 
            : product;

        return {
            ...ProductDTO.toPublic(product),
            owner: productObj.owner,
            created_at: productObj.createdAt,
            updated_at: productObj.updatedAt,
        };
    }
}