import UserRepository from '../repository/UserRepository.js';

export default class UserService {
    constructor() {
        this.repository = new UserRepository();
    }

    async createUser(userData) {
        return await this.repository.register(userData);
    }

    async getUserByEmail(email) {
        return await this.repository.getByEmail(email);
    }
    
    async getUserById(id) {
        return await this.repository.getById(id);
    }
}