import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string) {
    // find if user exists with the entered email
    const user = await this.usersService.findOneByEmail(username);

    if (!user) {
      return null;
    }

    // compare the entered password with the password in the database
    const match = await this.comparePassword(pass, user.password);

    if (!match) return null;

    // destructure the user object excludes password and return it
    const { _, ...result } = user['dataValues'];
    return result;
  }

  public async login(user) {
    const token = await this.generateToken(user);

    return { user, token };
  }

  public async createUser(user) {
    // hash the password
    const pass = await this.hashPassword(user.password);

    // create the user
    const newUser = await this.usersService.create({ ...user, password: pass });

    // destructure the user object excludes password and return it
    const { _, ...result } = newUser['dataValues'];

    // generate token
    const token = await this.generateToken(result);

    //return the user and the token
    return { user: result, token };
  }

  // private method to compare the password
  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  // private method to generate the token
  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  // private method to hash the password
  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
