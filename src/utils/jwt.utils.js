import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    const token = jwt.sign(
        { 
            _id: user._id, 
            email: user.email, 
            role: user.role 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
    );
    return token;
};

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).send({ error: 'No autenticado' });

    const token = authHeader.split(' ')[1]; 

    jwt.verify(token, process.env.JWT_SECRET, (err, credentials) => {
        if (err) return res.status(403).send({ error: 'No autorizado' });
        req.user = credentials.user || credentials; 
        next();
    });
};