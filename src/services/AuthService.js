import UserRepository from '../repository/UserRepository.js';
import MailService from './MailService.js';

export default class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
        this.mailService = new MailService();
    }

    async requestPasswordReset(email) {
        // Solicitar token al repository
        const result = await this.userRepository.requestPasswordReset(email);
        
        // Si el usuario existe y se generó token, enviar email
        if (result.success && result.resetToken) {
            await this.mailService.sendPasswordResetEmail(result.userEmail, result.resetToken);
        }
        
        return { 
            success: true, 
            message: 'Si el email está registrado, recibirás instrucciones para restablecer tu contraseña' 
        };
    }

    async resetPassword(token, newPassword, oldPassword) {
        return await this.userRepository.resetPassword(token, newPassword, oldPassword);
    }
}