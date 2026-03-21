import UserDao from '../dao/UserDao.js';
import { CartModel } from '../models/cart.model.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.utils.js';
import { generateToken, verifyToken } from '../utils/jwt.utils.js';

export default class UserRepository {
    constructor() {
        this.dao = new UserDao();
    }

    async register(userData) {
        const { first_name, last_name, email, age, password } = userData;

        // Validaciones
        if (!first_name || !last_name || !email || !age || !password) {
            throw new Error('Campos incompletos');
        }

        // Verificar email único
        if (await this.dao.existsByEmail(email)) {
            throw new Error('El email ya está registrado');
        }

        const newCart = new CartModel({ products: [] });
        await newCart.save();

       
        const hashedPassword = await hashPassword(password);

        // Crear usuario
        const user = await this.dao.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: newCart._id,
            role: 'user'
        });

        return user;
    }

    async login(email, password) {
        const user = await this.dao.findByEmailWithPassword(email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        // Validar contraseña
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            throw new Error('Credenciales inválidas');
        }

        // Generar token JWT
        const token = generateToken({
            _id: user._id,
            email: user.email,
            role: user.role
        });

        return { user, token };
    }

    async getById(userId) {
        return await this.dao.findById(userId);
    }

    async getByEmail(email) {
        return await this.dao.findByEmail(email);
    }

    async requestPasswordReset(email) {
    
    const user = await this.dao.findByEmail(email);
    
    if (!user) {
        return { success: true, message: 'Si el email existe, recibirás instrucciones' };
    }

    
    const resetToken = generateToken(
        { 
            userId: user._id.toString(), 
            email: user.email, 
            type: 'password_reset' 
        },
        { expiresIn: '1h' }  
    );

    return { 
        success: true, 
        resetToken, 
        userEmail: user.email,
        message: 'Token generado exitosamente'
    };
}


async resetPassword(resetToken, newPassword, oldPassword) {
    // Verificar token JWT
    let decoded;
    try {
        decoded = verifyToken(resetToken);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }

    // Verificar que es un token de recovery
    if (!decoded || decoded.type !== 'password_reset') {
        throw new Error('Token inválido o expirado');
    }

    // Buscar usuario
    const user = await this.dao.findById(decoded.userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Validar que la nueva contraseña NO sea igual a la anterior
    const isSamePassword = await comparePassword(newPassword, user.password);
    if (isSamePassword) {
        throw new Error('La nueva contraseña no puede ser igual a la anterior');
    }

    // Encriptar nueva contraseña y actualizar
    const hashedPassword = await hashPassword(newPassword);
    await this.dao.updatePassword(decoded.userId, hashedPassword);

    return { success: true, message: 'Contraseña actualizada exitosamente' };
}
}