export default class UserDTO {
    /**
     * @param {Object} user 
     * @returns {Object} 
     */
    static toPublic(user) {
        if (!user) return null;
        
       
        const userObj = typeof user.toObject === 'function' 
            ? user.toObject() 
            : user;

        return {
            id: userObj._id,
            first_name: userObj.first_name,
            last_name: userObj.last_name,
            email: userObj.email,
            age: userObj.age,
            role: userObj.role,
            cart: userObj.cart,
            
        };
    }

    
    static toAdmin(user) {
        if (!user) return null;
        
        const userObj = typeof user.toObject === 'function' 
            ? user.toObject() 
            : user;

        return {
            ...UserDTO.toPublic(user),
            created_at: userObj.createdAt,
            updated_at: userObj.updatedAt,
        };
    }
}