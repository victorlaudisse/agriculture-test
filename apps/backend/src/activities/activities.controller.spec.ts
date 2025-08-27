import { Test, TestingModule } from "@nestjs/testing";
import { Activity, ActivityType } from "@prisma/client";

import { ActivitiesController } from "./activities.controller";
import { CreateActivityDto } from "./activities.dto";
import { ActivitiesService } from "./activities.service";

import { AuthGuard } from "@/auth/auth.guard";

describe("ActivitiesController", () => {
  let controller: ActivitiesController;
  let activityServiceMock: {
    createActivity: jest.Mock;
    findAll: jest.Mock;
  };

  beforeEach(async () => {
    activityServiceMock = {
      createActivity: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: activityServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("POST /fields/:id/activities", () => {
    it("should call activityService.createActivity and return the result", async () => {
      const userId = "user-123";
      const fieldId = "field-abc";
      const dto: CreateActivityDto = {
        type: ActivityType.PLANTIO,
        date: "2025-08-27T10:00:00.000Z",
        notes: "Plantio de soja",
      };
      const mockActivity: Activity = {
        id: "activity-1",
        date: new Date(dto.date),
        created_at: new Date(),
        type: dto.type,
        field_id: fieldId,
        notes: dto.notes ? dto.notes : null,
      };
      activityServiceMock.createActivity.mockResolvedValue(mockActivity);
      const result = await controller.create(userId, fieldId, dto);
      expect(activityServiceMock.createActivity).toHaveBeenCalledWith(
        userId,
        fieldId,
        dto,
      );
      expect(result).toEqual(mockActivity);
    });
  });

  describe("GET /fields/:id/activities", () => {
    it("should call activityService.findAll and return the result", async () => {
      const userId = "user-123";
      const fieldId = "field-abc";
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
      activityServiceMock.findAll.mockResolvedValue(mockAcitivities);
      const result = await controller.findAll(userId, fieldId);
      expect(activityServiceMock.findAll).toHaveBeenCalledWith(userId, fieldId);
      expect(result).toEqual(mockAcitivities);
    });
  });
});
