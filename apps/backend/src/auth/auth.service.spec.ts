import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "@prisma/client";
import * as argon2 from "argon2";
import { SignUpDto } from "src/auth/auth.dto";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "src/users/users.service";

describe("AuthService", () => {
  let service: AuthService;
  let usersServiceMock: Partial<UsersService>;
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(async () => {
    usersServiceMock = {
      findOneByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    jwtServiceMock = {
      signAsync: jest.fn().mockResolvedValue("jwt mock"),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe("signIn", () => {
    it("should return access_token with valid credentials", async () => {
      const mockUser: User = {
        id: "123",
        email: "test@example.com",
        name: "Test",
        password_hash: await argon2.hash("password123"),
        created_at: new Date(),
      };
      (usersServiceMock.findOneByEmail as jest.Mock).mockResolvedValue(
        mockUser,
      );
      const result = await service.signIn("test@example.com", "password123");
      expect(result).toEqual({
        access_token: "jwt mock",
      });
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        id: mockUser.id,
      });
    });

    it("should throw UnauthorizedException if password is invalid", async () => {
      const mockUser: User = {
        id: "123",
        email: "test@example.com",
        name: "Test",
        password_hash: await argon2.hash("password123"),
        created_at: new Date(),
      };
      (usersServiceMock.findOneByEmail as jest.Mock).mockResolvedValue(
        mockUser,
      );
      await expect(
        service.signIn("test@example.com", "wrong123"),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if none user is found", async () => {
      (usersServiceMock.findOneByEmail as jest.Mock).mockResolvedValue(null);
      await expect(
        service.signIn("unexsistent@example.com", "password123"),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("signUp", () => {
    it("should create an user and return access_token", async () => {
      const dto: SignUpDto = {
        email: "test@example.com",
        name: "Test",
        password: "password123",
      };
      const mockUser: User = {
        id: "123",
        email: "test@example.com",
        name: "Test",
        password_hash: await argon2.hash("password123"),
        created_at: new Date(),
      };
      (usersServiceMock.findOneByEmail as jest.Mock).mockResolvedValue(null);
      (usersServiceMock.createUser as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.signUp(dto);
      expect(result).toEqual({ access_token: "jwt mock" });
      expect(usersServiceMock.findOneByEmail).toHaveBeenCalledWith(dto.email);
      expect(usersServiceMock.createUser).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.signAsync).toHaveBeenCalledTimes(1);
    });

    it("should throw ConflictException with the e-mail already is in use", async () => {
      const dto: SignUpDto = {
        email: "test@example.com",
        name: "Test",
        password: "password123",
      };
      const mockUser: User = {
        id: "123",
        email: "test@example.com",
        name: "Test",
        password_hash: await argon2.hash("password123"),
        created_at: new Date(),
      };
      (usersServiceMock.findOneByEmail as jest.Mock).mockResolvedValue(
        mockUser,
      );
      await expect(service.signUp(dto)).rejects.toThrow(ConflictException);
    });
  });
});
