import {UserRepository} from "../repositories/user.repository";

export class AuthService {

  private repository = new UserRepository();

  login(email: string, password: string) {

    if (!email || !password) {
      throw new Error("Invalid credentials");
    }

    const user: any = this.repository.findByEmail(email);

    if (!user || user.password !== password) {
      throw new Error("Authentication failed");
    }

    return {email: user.email};
  }
}