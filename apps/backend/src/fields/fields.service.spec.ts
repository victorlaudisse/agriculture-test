import { NotFoundException } from "@nestjs/common";
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
      findMany: jest.fn(),
      findFirst: jest.fn(),
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

  describe("getFieldsByUser", () => {
    it("should return all fields for a given user", async () => {
      const userId = "user-123";
      const mockFields: Field[] = [
        {
          id: "field-1",
          name: "Talhão 1",
          crop: "Soja",
          area_ha: new Prisma.Decimal(10),
          latitude: new Prisma.Decimal(-22.9),
          longitude: new Prisma.Decimal(-47.0),
          created_at: new Date(),
          user_id: userId,
        },
        {
          id: "field-2",
          name: "Talhão 2",
          crop: "Milho",
          area_ha: new Prisma.Decimal(20),
          latitude: new Prisma.Decimal(-22.8),
          longitude: new Prisma.Decimal(-47.1),
          created_at: new Date(),
          user_id: userId,
        },
      ];
      (prismaMock.field.findMany as jest.Mock).mockResolvedValue(mockFields);
      const result = await service.getFieldsByUser(userId);
      expect(prismaMock.field.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
      });
      expect(result).toEqual(mockFields);
    });
  });

  describe("findOneById", () => {
    it("should return the field if it belongs to the given user", async () => {
      const userId = "user-123";
      const fieldId = "field-xyz";
      const mockField: Field = {
        id: "field-1",
        name: "Talhão 1",
        crop: "Soja",
        area_ha: new Prisma.Decimal(10),
        latitude: new Prisma.Decimal(-22.9),
        longitude: new Prisma.Decimal(-47.0),
        created_at: new Date(),
        user_id: userId,
      };
      (prismaMock.field.findFirst as jest.Mock).mockResolvedValue(mockField);
      const result = await service.findOneById(userId, fieldId);
      expect(prismaMock.field.findFirst).toHaveBeenCalledWith({
        where: { id: fieldId, user_id: userId },
      });
      expect(result).toEqual(mockField);
    });

    it("should throw NotFoundException if field does not exist or does not belong to the given user", async () => {
      const userId = "user-123";
      const fieldId = "field-xyz";
      (prismaMock.field.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.findOneById(userId, fieldId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
