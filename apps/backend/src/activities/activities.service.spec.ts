import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Activity, ActivityType } from "@prisma/client";

import { CreateActivityDto } from "./activities.dto";
import { ActivitiesService } from "./activities.service";

import { PrismaService } from "@/prisma/prisma.service";

describe("ActivitiesService", () => {
  let service: ActivitiesService;
  const prismaMock = {
    field: { findFirst: jest.fn() },
    activity: { create: jest.fn(), findMany: jest.fn() },
  } as unknown as PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
  });

  describe("createActivity", () => {
    it("should create an activity if field belongs to user", async () => {
      const userId = "user-123";
      const fieldId = "field-xyz";
      const dto: CreateActivityDto = {
        type: ActivityType.PLANTIO,
        date: "2025-08-27T10:00:00.000Z",
        notes: "Plantio da safra 2025",
      };
      const mockAcitivity: Activity = {
        id: "activity-1",
        field_id: fieldId,
        type: dto.type,
        notes: dto.notes ? dto.notes : null,
        date: new Date(dto.date),
        created_at: new Date(),
      };
      (prismaMock.field.findFirst as jest.Mock).mockResolvedValue({
        id: fieldId,
        user_id: userId,
      });
      (prismaMock.activity.create as jest.Mock).mockResolvedValue(
        mockAcitivity,
      );
      const result = await service.createActivity(userId, fieldId, dto);
      expect(prismaMock.field.findFirst).toHaveBeenCalledWith({
        where: {
          id: fieldId,
          user_id: userId,
        },
      });
      expect(prismaMock.activity.create).toHaveBeenCalledWith({
        data: {
          type: dto.type,
          date: new Date(dto.date),
          notes: dto.notes,
          field_id: fieldId,
        },
      });
      expect(result).toEqual(mockAcitivity);
    });

    it("should throw NotFoundException if field does not belong to user", async () => {
      const userId = "user-123";
      const fieldId = "field-xyz";
      const dto: CreateActivityDto = {
        type: ActivityType.PLANTIO,
        date: "2025-08-27T10:00:00.000Z",
        notes: "Plantio da safra 2025",
      };
      (prismaMock.field.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(
        service.createActivity(userId, fieldId, dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("findAll", () => {
    it("should return activities if field belongs to user", async () => {
      const userId = "user-123";
      const fieldId = "field-xyz";
      const mockAcitivities: Activity[] = [
        {
          id: "activity-1",
          field_id: fieldId,
          type: ActivityType.PLANTIO,
          notes: "Plantio da safra 2025",
          date: new Date("2025-08-27T10:00:00.000Z"),
          created_at: new Date(),
        },
        {
          id: "activity-2",
          field_id: fieldId,
          type: ActivityType.ADUBACAO,
          notes: "Adubação da safra 2025",
          date: new Date("2025-08-30T10:00:00.000Z"),
          created_at: new Date(),
        },
      ];
      (prismaMock.field.findFirst as jest.Mock).mockResolvedValue({
        id: fieldId,
        user_id: userId,
      });
      (prismaMock.activity.findMany as jest.Mock).mockResolvedValue(
        mockAcitivities,
      );
      const result = await service.findAll(userId, fieldId);
      expect(prismaMock.field.findFirst).toHaveBeenCalledWith({
        where: {
          id: fieldId,
          user_id: userId,
        },
      });
      expect(prismaMock.activity.findMany).toHaveBeenCalledWith({
        where: {
          field_id: fieldId,
        },
        orderBy: {
          date: "desc",
        },
      });
      expect(result).toEqual(mockAcitivities);
    });

    it("should throw NotFoundException if field does not belong to user", async () => {
      const userId = "user-123";
      const fieldId = "field-xyz";
      (prismaMock.field.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.findAll(userId, fieldId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
