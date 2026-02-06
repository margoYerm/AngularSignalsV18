import {USERS} from "../db-data";

export class UserRepository {

  findByEmail(email: string) {
    return Object.values(USERS).find(
      (user: any) => user.email === email
    );
  }
}