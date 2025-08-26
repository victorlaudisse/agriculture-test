import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { SignInDto, SignUpDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post("register")
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp({
      name: signUpDto.name,
      email: signUpDto.email,
      password: signUpDto.password,
    });
  }
}
