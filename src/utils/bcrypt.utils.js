import bcrypt from 'bcrypt';

export const hashPassword = async (password, saltRounds = 10) => {
    return await bcrypt.hash(password, saltRounds);
};

export const hashPasswordSync = (password, saltRounds = 10) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const comparePasswordSync = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};