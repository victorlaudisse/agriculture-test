import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateActivityDto } from "./activities.dto";

import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class ActivitiesService {
  constructor(private prismaService: PrismaService) {}

  async createActivity(
    userId: string,
    fieldId: string,
    dto: CreateActivityDto,
  ) {
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
    return this.prismaService.activity.create({
      data: {
        type: dto.type,
        date: new Date(dto.date),
        notes: dto.notes,
        field_id: fieldId,
      },
    });
  }

  async findAll(userId: string, fieldId: string) {
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
    return await this.prismaService.activity.findMany({
      where: {
        field_id: fieldId,
      },
      orderBy: {
        date: "desc",
      },
    });
  }
}
