import UserService from '../services/user.service.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.utils.js';

const userService = new UserService();

export default class SessionController {
    async register(req, res) {
        try {
            const { first_name, last_name, email, age, password } = req.body;

            if (!first_name || !last_name || !email || !age || !password) {
                return res.status(400).send({ status: 'error', error: 'Campos incompletos' });
            }

            const user = await userService.createUser({ first_name, last_name, email, age, password });

            
            const userObject = user.toObject();
            const { password: _, ...userWithoutPassword } = userObject;
            
            res.status(201).send({ status: 'success', payload: userWithoutPassword });
            
        } catch (error) {
            console.error('Error en register:', error.message);
            
            if (error.message === 'El usuario ya existe') {
                return res.status(400).send({ status: 'error', error: 'El email ya está registrado' });
            }
            res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await userService.getUserByEmail(email);
            if (!user) return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });

            const isValidPassword = bcrypt.compareSync(password, user.password);
            if (!isValidPassword) return res.status(401).send({ status: 'error', error: 'Contraseña incorrecta' });

            const token = generateToken(user);

            // Establecer cookie con el token
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            });

            res.send({
                status: 'success',
                message: 'Login exitoso',
                token: token
            });
        } catch (error) {
            console.error('Error en login:', error.message);
            res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
        }
    }

    async current(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ status: 'error', error: 'No autenticado' });
            }

            // Compatibilidad: req.user puede ser doc de Mongoose o objeto plano
            const userObject = typeof req.user.toObject === 'function' 
                ? req.user.toObject() 
                : req.user;
            
            const { password, ...userWithoutPassword } = userObject;

            res.send({
                status: 'success',
                payload: userWithoutPassword
            });
        } catch (error) {
            console.error('❌ Error en current:', error.message);
            res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
        }
    }
}