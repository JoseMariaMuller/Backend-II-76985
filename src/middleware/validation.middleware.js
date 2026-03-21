export const validateResetPassword = (req, res, next) => {
   
    const { token, newPassword, oldPassword } = req.body || {};
    
    if (!token || !newPassword || !oldPassword) {
        return res.status(400).json({ 
            error: 'Token, nueva contraseña y contraseña anterior son requeridos' 
        });
    }
    
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    
    if (newPassword === oldPassword) {
        return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la anterior' });
    }
    
    next();
};