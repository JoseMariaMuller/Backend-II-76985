// src/services/MailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export default class MailService {
    constructor() {
        
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS  
            }
        });
    }

    async sendPasswordResetEmail(userEmail, resetToken) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
        
        console.log(' [MailService] Enviando recovery a:', userEmail);
        console.log(' [MailService] Token generado:', resetToken);
        console.log(' [MailService] Link de recovery:', resetUrl);
        
        const mailOptions = {
            from: `Ecommerce App <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: ' Restablecimiento de contraseña - Ecommerce',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2> Restablecer tu contraseña</h2>
                    <p>Hola,</p>
                    <p>Has solicitado restablecer tu contraseña. Haz clic en el botón para continuar:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #007bff; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Restablecer contraseña
                        </a>
                    </div>
                    
                    <p><small>Este enlace expirará en <strong>1 hora</strong>.</small></p>
                    <p><small>Si no solicitaste este cambio, ignora este correo.</small></p>
                    
                    <hr/>
                    <p style="color: #666; font-size: 12px;">
                        Ecommerce App - Sistema de autenticación segura
                    </p>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(' [MailService] Email enviado. MessageId:', info.messageId);
            
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(' [MailService] Error enviando email:', error.message);
            return { success: false, error: error.message };
        }
    }
}