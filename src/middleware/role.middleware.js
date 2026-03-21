/**
 * @param  {...string} allowedRoles
 * @returns {Function} 
 */
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Verificar que el usuario está autenticado
        if (!req.user) {
            return res.status(401).json({ 
                status: 'error', 
                error: 'No autenticado' 
            });
        }
        
        // Verificar que el usuario tiene uno de los roles permitidos
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                status: 'error', 
                error: 'Acceso denegado',
                message: `Se requiere rol: ${allowedRoles.join(' o ')}. Tu rol: ${req.user.role}`
            });
        }
        
        // Rol válido, continuar
        next();
    };
};


export const isAdmin = authorizeRoles('admin');
export const isUser = authorizeRoles('user');
export const isAdminOrUser = authorizeRoles('admin', 'user');