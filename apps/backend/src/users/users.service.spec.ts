import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";

import { UsersService } from "./users.service";
import { User } from "generated/prisma";

describe("UsersService", () => {
  let service: UsersService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
  } as unknown as PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an User when exists", async () => {
    const fakeUser: User = {
      id: "u-1",
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: "hashed",
      created_at: new Date(),
    };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);
    const result = await service.findOneByEmail("johndoe@example.com");
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "johndoe@example.com" },
    });
    expect(result).toEqual(fakeUser);
  });

  it("should return null when user doesn't exist", async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    const result = await service.findOneByEmail("none@example.com");
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "none@example.com" },
    });
    expect(result).toBeNull();
  });
});
