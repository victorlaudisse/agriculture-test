import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";

import { CreateActivityDto } from "./activities.dto";
import { ActivitiesService } from "./activities.service";

import { AuthGuard } from "@/auth/auth.guard";
import { User } from "@/auth/user.decorator";

@Controller("fields/:id/activities")
@UseGuards(AuthGuard)
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Post()
  async create(
    @User("id") userId: string,
    @Param("id") fieldId: string,
    @Body() dto: CreateActivityDto,
  ) {
    return await this.activitiesService.createActivity(userId, fieldId, dto);
  }

  @Get()
  async findAll(@User("id") userId: string, @Param("id") fieldId: string) {
    return await this.activitiesService.findAll(userId, fieldId);
  }
}
