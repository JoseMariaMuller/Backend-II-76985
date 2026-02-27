import express from 'express';
import mongoose from 'mongoose';
import passport from './config/passport.config.js';
import sessionsRouter from './routes/sessions.router.js';
import cookieParser from 'cookie-parser'; 
import dotenv from 'dotenv';

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

// Rutas
app.use('/api/sessions', sessionsRouter);


app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(' Error:', err.message);
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Token inválido o inexistente' });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Error en el token' });
    }
    
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
});

export default app;