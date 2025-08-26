import { Test, TestingModule } from "@nestjs/testing";

import { AuthController } from "./auth.controller";
import { SignInDto, SignUpDto } from "./auth.dto";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let authServiceMock: {
    signIn: jest.Mock;
    signUp: jest.Mock;
  };

  beforeEach(async () => {
    authServiceMock = {
      signIn: jest.fn(),
      signUp: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should call authService.signIn and return access_token", async () => {
    const dto: SignInDto = {
      email: "test@example.com",
      password: "123456",
    };
    authServiceMock.signIn.mockResolvedValue({ access_token: "jwt mock" });
    const result = await controller.signIn(dto);
    expect(authServiceMock.signIn).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );
    expect(result).toEqual({ access_token: "jwt mock" });
  });

  it("should call authService.signUp and return access_token", async () => {
    const dto: SignUpDto = {
      name: "Victor",
      email: "victor@example.com",
      password: "123456",
    };
    authServiceMock.signUp.mockResolvedValue({ access_token: "jwt mock" });
    const result = await controller.signUp(dto);
    expect(authServiceMock.signUp).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ access_token: "jwt mock" });
  });
});
