import UserRepository from '../repository/UserRepository.js';
import UserDTO from '../dto/UserDTO.js';


const userRepository = new UserRepository();

export default class SessionController {
    async register(req, res) {
        try {
            const { first_name, last_name, email, age, password } = req.body;

            const user = await userRepository.register({ 
                first_name, last_name, email, age, password 
            });

            
            const userDTO = UserDTO.toPublic(user);
            
            res.status(201).json({ status: 'success', payload: userDTO });
            
        } catch (error) {
            console.error('Error en register:', error.message);
            
            if (error.message === 'El email ya está registrado') {
                return res.status(400).json({ status: 'error', error: 'El email ya está registrado' });
            }
            if (error.message === 'Campos incompletos') {
                return res.status(400).json({ status: 'error', error: 'Campos incompletos' });
            }
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const { user, token } = await userRepository.login(email, password);

            // Establecer cookie con el token
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            });

            res.json({
                status: 'success',
                message: 'Login exitoso',
                token: token 
            });
        } catch (error) {
            console.error('Error en login:', error.message);
            
            if (error.message === 'Credenciales inválidas') {
                return res.status(401).json({ status: 'error', error: 'Credenciales inválidas' });
            }
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }

    async current(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ status: 'error', error: 'No autenticado' });
            }
            const userDTO = UserDTO.toPublic(req.user);
            res.json({
                status: 'success',
                payload: userDTO
            });
        } catch (error) {
            console.error('Error en current:', error.message);
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    }
}