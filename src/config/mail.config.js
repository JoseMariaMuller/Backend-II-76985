import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


export const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,  // true para 465, false para otros puertos
    auth: {
        user: process.env.EMAIL_USER,     
        pass: process.env.EMAIL_PASS       
    }
});


export const verifyMailConnection = async () => {
    try {
        await mailTransport.verify();
        console.log('Servidor de correo listo para enviar');
        return true;
    } catch (error) {
        console.error('Error de conexión con el servidor de correo:', error.message);
        return false;
    }
};