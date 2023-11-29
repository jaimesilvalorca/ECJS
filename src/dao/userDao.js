import UserModel from "../models/user.model.js";


export default class userDaoMongo {
  constructor() {
    this.model = UserModel
  }

  async getAll() {
    let result = await this.model.find();
    return result;
  }

  async save(user) {
    let result = await this.model.create(user);
    return result;
  }

  async update(userId, userData) {
    let result = await this.model.findByIdAndUpdate(userId, userData, {
      new: true
    });
    return result;
  }

  async deleteById(userId) {
    let result = await this.model.findByIdAndDelete(userId);
    return result;
  }

  async getById(userId) {
    let result = await this.model.findById(userId);
    return result;
  }
}