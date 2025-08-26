import { Injectable } from "@nestjs/common";
import { User } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: data.passwordHash,
      },
    });
  }
}
