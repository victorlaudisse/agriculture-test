import { Test, TestingModule } from "@nestjs/testing";
import { Field, Prisma } from "@prisma/client";

import { FieldsController } from "./fields.controller";
import { CreateFieldDto } from "./fields.dto";
import { FieldsService } from "./fields.service";

import { AuthGuard } from "@/auth/auth.guard";

describe("FieldsController", () => {
  let controller: FieldsController;
  let fieldsServiceMock: {
    createField: jest.Mock;
  };

  beforeEach(async () => {
    fieldsServiceMock = {
      createField: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldsController],
      providers: [
        {
          provide: FieldsService,
          useValue: fieldsServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FieldsController>(FieldsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("POST /fields", () => {
    it("should call fieldsService.createField and return the field", async () => {
      const userId = "user-123";
      const dto: CreateFieldDto = {
        name: "Talhão Norte",
        crop: "Milho",
        area: 20.5,
        latitude: -22.9,
        longitude: -47.0,
      };
      const expectedResult: Field = {
        id: "field-xyz",
        name: dto.name,
        crop: dto.crop,
        area_ha: new Prisma.Decimal(dto.area),
        latitude: new Prisma.Decimal(dto.latitude),
        longitude: new Prisma.Decimal(dto.longitude),
        user_id: userId,
        created_at: new Date(),
      };
      fieldsServiceMock.createField.mockResolvedValue(expectedResult);
      const result = await controller.create(userId, dto);
      expect(fieldsServiceMock.createField).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
