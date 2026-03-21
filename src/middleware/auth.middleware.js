import passport from 'passport';

export const authenticateJWT = (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
        if (err) {
            console.error('Error de autenticación:', err);
            return res.status(500).json({ error: 'Error interno de autenticación' });
        }
        
        if (!user) {
            return res.status(401).json({ error: info?.message || 'No autenticado' });
        }
        
        req.user = user;
        next();
    })(req, res, next);
};