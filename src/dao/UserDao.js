import BaseDao from './BaseDao.js';
import { UserModel } from '../models/user.model.js';

export default class UserDao extends BaseDao {
    constructor() {
        super(UserModel);
    }

    async findByEmail(email) {
        return await this.model.findOne({ email }).select('-password').lean();
    }

    async findByEmailWithPassword(email) {
        return await this.model.findOne({ email }).select('+password').lean();
    }

    async existsByEmail(email) {
        const count = await this.model.countDocuments({ email });
        return count > 0;
    }

    async updatePassword(userId, hashedPassword) {
        return await this.model.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { returnDocument: "after" }
        ).select('-password').lean();
    }
}