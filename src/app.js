import express from 'express';
import mongoose from 'mongoose';
import passport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

//  Routers
import sessionsRouter from './routes/sessions.router.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import authRouter from './routes/auth.routes.js';
import ticketsRouter from './routes/tickets.routes.js';

// Mail config
import { mailTransport, verifyMailConnection } from './config/mail.config.js';

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log(' Conectado a BD'))
    .catch(err => console.error(' Error MongoDB:', err.message));

// Verificar conexión de email al iniciar 
verifyMailConnection();

// Rutas
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketsRouter);

// ENDPOINT DE MAIL 
app.get('/mail', async (req, res) => {
    try {
        const testEmail = req.query.to || 'testdao@unico.com';
        
        let result = await mailTransport.sendMail({
            from: `Coder Tests <${process.env.EMAIL_USER || 'noreply@ecommerce.test'}>`,
            to: testEmail,
            subject: ' Correo de prueba - Nodemailer',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #007bff;">¡Esto es un test! </h1>
                    <p>Si recibiste este correo, <strong>nodemailer</strong> está funcionando correctamente.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong> Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
                        <p><strong> Servidor:</strong> Express + Nodemailer</p>
                        <p><strong> Estado:</strong> Funcionando</p>
                    </div>
                    
                    <p>¡Tu configuración de email es correcta!</p>
                    
                    <hr style="margin: 30px 0;"/>
                    <p style="color: #666; font-size: 12px;">
                        Ecommerce Backend - Entrega Final<br/>
                        Jose Maria Muller
                    </p>
                </div>
            `,
            attachments: []
        });
        
        res.json({
            status: 'success',
            message: 'Email enviado exitosamente',
            messageId: result.messageId
        });
    } catch (error) {
        console.error(' Error enviando email:', error.message);
        res.status(500).json({
            status: 'error',
            error: 'Error al enviar email',
            message: error.message
        });
    }
});


app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(' Error global:', err.message);
        console.error('Stack:', err.stack);
    }
    
    if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
            status: 'error', 
            error: 'Token inválido o expirado' 
        });
    }
    
    if (err.name === 'MongoServerError' && err.code === 11000) {
        return res.status(400).json({ 
            status: 'error', 
            error: 'El email ya está registrado' 
        });
    }
    
    res.status(500).json({ 
        status: 'error', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor' 
    });
});

export default app;