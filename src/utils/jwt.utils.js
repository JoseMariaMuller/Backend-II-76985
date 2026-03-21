import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @param {Object} payload 
 * @param {Object} options 
 * @returns {string} 
 */
export const generateToken = (payload, options = {}) => {
    const defaultOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, { ...defaultOptions, ...options });
};

/**
 * @param {string} token 
 * @returns {Object}
 * @throws {Error} 
 */
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * @param {string} token 
 * @returns {Object}
 */
export const decodeToken = (token) => {
    return jwt.decode(token);
};