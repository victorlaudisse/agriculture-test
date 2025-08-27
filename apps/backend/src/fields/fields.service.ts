import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateFieldDto } from "./fields.dto";

import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class FieldsService {
  constructor(private prismaService: PrismaService) {}

  async createField(userId: string, dto: CreateFieldDto) {
    const field = await this.prismaService.field.create({
      data: {
        name: dto.name,
        crop: dto.crop,
        area_ha: dto.area,
        latitude: dto.latitude,
        longitude: dto.longitude,
        user_id: userId,
      },
    });
    return field;
  }

  async getFieldsByUser(userId: string) {
    return this.prismaService.field.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async getFieldById(userId: string, fieldId: string) {
    const field = await this.prismaService.field.findFirst({
      where: {
        id: fieldId,
        user_id: userId,
      },
    });
    if (!field) {
      throw new NotFoundException(
        "Talhão não encontrado ou falta de acesso ao talhão.",
      );
    }
    return field;
  }
}
