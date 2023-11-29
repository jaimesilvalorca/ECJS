import userDaoMongo from "./userDao.js";

export default class UserRepository {
  constructor() {
    this.dao = new userDaoMongo();
  }

  async getCurrentUser(userId) {
    const user = await this.dao.getById(userId);
    return user;
  }

  async getUserById(userId) {
    const user = await this.dao.getById(userId);
    return user;
  }
}