import userRepository from "../dao/userRepository.js";

export default class UserService {
  constructor() {
    this.userRepository = new userRepository();
  }

  async getCurrentUser(userId) {
    const user = await this.userRepository.getCurrentUser(userId);
    return user;
  }

  async getUserById(userId) {
    return await this.userRepository.getUserById(userId);
  }
}