import UserRepository from '../repository/UserRepository.js';
import UserDTO from '../dto/UserDTO.js';
import AuthService from '../services/AuthService.js';

const userRepository = new UserRepository();
const authService = new AuthService();  

export default class AuthController {
    
    async current(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }

            const userDTO = UserDTO.toPublic(req.user);

            res.json({ 
                status: 'success', 
                payload: userDTO 
            });
        } catch (error) {
            console.error('Error en current:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

   
    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({ error: 'Email es requerido' });
            }

            const result = await authService.requestPasswordReset(email);
            
            res.json({ 
                status: 'success', 
                message: result.message || 'Si el email existe, recibirás instrucciones' 
            });
        } catch (error) {
            console.error('Error en requestPasswordReset:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    
    async resetPassword(req, res) {
        try {
            const { token, newPassword, oldPassword } = req.body;
            
            if (!token || !newPassword || !oldPassword) {
                return res.status(400).json({ error: 'Token, nueva contraseña y contraseña anterior son requeridos' });
            }
            
            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
            }

            const result = await authService.resetPassword(token, newPassword, oldPassword);
            
            res.json({ 
                status: 'success', 
                message: 'Contraseña actualizada exitosamente' 
            });
        } catch (error) {
            console.error('Error en resetPassword:', error.message);
            
            if (error.message === 'Token inválido o expirado') {
                return res.status(400).json({ error: 'El enlace de recuperación ha expirado o es inválido' });
            }
            if (error.message === 'La nueva contraseña no puede ser igual a la anterior') {
                return res.status(400).json({ error: error.message });
            }
            
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}