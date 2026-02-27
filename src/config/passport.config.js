import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();


const jwtOptions = {
    
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
            
            if (req?.cookies?.token) {
                return req.cookies.token;
            }
            return null;
        }
    ]),
    secretOrKey: process.env.JWT_SECRET
};

// Validación defensiva
if (!process.env.JWT_SECRET) {
    console.error('FALTA JWT_SECRET en .env');
    process.exit(1);
}


passport.use('current', new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
        const user = await UserModel.findById(jwt_payload._id);
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;