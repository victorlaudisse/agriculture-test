import { Injectable } from "@nestjs/common";

import { RegisterDto } from "./auth.dto";

@Injectable()
export class AuthService {
  async register(dto: RegisterDto) {}
}
