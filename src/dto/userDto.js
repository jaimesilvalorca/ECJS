export default class ReducedUserDTO {
    constructor(user) {
      this.id = user.id
      this.fullname = `${user.first_name} ${user.last_name}`
      this.email = email;
    }
  }