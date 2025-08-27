import { Test, TestingModule } from "@nestjs/testing";
import { Field, Prisma } from "@prisma/client";

import { CreateFieldDto } from "./fields.dto";
import { FieldsService } from "./fields.service";

import { PrismaService } from "@/prisma/prisma.service";

describe("FieldsService", () => {
  let service: FieldsService;
  const prismaMock = {
    field: {
      create: jest.fn(),
    },
  } as unknown as PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FieldsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<FieldsService>(FieldsService);
  });

  describe("createField", () => {
    it("should create field and return the result", async () => {
      const userId = "user-id-123";
      const dto: CreateFieldDto = {
        name: "Talhão Norte",
        crop: "Soja",
        area: 10.5,
        latitude: -22.9,
        longitude: -47.06,
      };
      const mockField: Field = {
        id: "field-id-123",
        ...dto,
        area_ha: new Prisma.Decimal(dto.area),
        latitude: new Prisma.Decimal(dto.latitude),
        longitude: new Prisma.Decimal(dto.longitude),
        user_id: userId,
        created_at: new Date(),
      };
      (prismaMock.field.create as jest.Mock).mockResolvedValue(mockField);
      const result = await service.createField(userId, dto);
      expect(prismaMock.field.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          crop: dto.crop,
          area_ha: dto.area,
          latitude: dto.latitude,
          longitude: -47.06,
          user_id: userId,
        },
      });
      expect(result).toEqual(mockField);
    });
  });
});
