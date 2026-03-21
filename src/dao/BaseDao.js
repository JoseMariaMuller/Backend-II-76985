export default class BaseDao {
    constructor(model) {
        this.model = model;
    }

    async findById(id) {
        return await this.model.findById(id).lean();
    }

    async findAll(filters = {}, options = {}) {
        return await this.model.find(filters, null, options).lean();
    }

    async create(data) {
        const entity = new this.model(data);
        return await entity.save();
    }

    async updateById(id, data) {
        return await this.model.findByIdAndUpdate(
            id, 
            data, 
            { returnDocument: "after", runValidators: true }
        ).lean();
    }

    async deleteById(id) {
        return await this.model.findByIdAndDelete(id);
    }
}