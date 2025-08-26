import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { UsersService } from "src/users/users.service";

import { SignUpDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    const passwordMatch =
      user && (await argon2.verify(user.password_hash, password));
    if (!user || !passwordMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp({ name, email, password }: SignUpDto) {
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException("Este e-mail já está em uso.");
    }
    const passwordHash = await argon2.hash(password);
    const user = await this.usersService.createUser({
      name,
      email,
      passwordHash,
    });
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
