import { UserModel } from '../models/user.model.js';
import { CartModel } from '../models/cart.model.js';
import bcrypt from 'bcrypt';

export default class UserService {
    async createUser(userData) {
        try {
            const { first_name, last_name, email, age, password } = userData;

            if (!first_name || !last_name || !email || !age || !password) {
                throw new Error('Campos incompletos');
            }

            const exist = await UserModel.findOne({ email });
            if (exist) throw new Error('El usuario ya existe');

            // Crear carrito
            const newCart = new CartModel({ products: [] });
            await newCart.save();

            // Encriptar contraseña
            const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

            const newUser = new UserModel({
                first_name,
                last_name,
                email,
                age,
                password: hashPassword,
                cart: newCart._id,
                role: 'user'
            });

            await newUser.save();
            
            
            return newUser;
            
        } catch (error) {
            throw new Error(error.message || 'Error al crear usuario');
        }
    }

    async getUserByEmail(email) {
        return await UserModel.findOne({ email });
    }
    
    async getUserById(id) {
        return await UserModel.findById(id);
    }
}