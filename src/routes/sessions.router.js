import { Router } from 'express';
import SessionController from '../controllers/sessions.controller.js';
import passport from 'passport';

const router = Router();
const sessionController = new SessionController();


router.post('/register', (req, res) => {
    sessionController.register(req, res)
        .catch(err => {
            console.error('Error en route register:', err);
            res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
        });
});

router.post('/login', (req, res) => {
    sessionController.login(req, res)
        .catch(err => {
            console.error('Error en route login:', err);
            res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
        });
});

router.get('/current', 
    passport.authenticate('current', { session: false }), 
    (req, res) => {
        sessionController.current(req, res)
            .catch(err => {
                console.error('Error en route current:', err);
                res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
            });
    }
);

export default router;