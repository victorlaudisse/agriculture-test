import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";

import { CreateFieldDto } from "./fields.dto";
import { FieldsService } from "./fields.service";

import { AuthGuard } from "@/auth/auth.guard";
import { User } from "@/auth/user.decorator";

@Controller("fields")
@UseGuards(AuthGuard)
export class FieldsController {
  constructor(private fieldsService: FieldsService) {}

  @Post()
  async create(@User("id") userId: string, @Body() dto: CreateFieldDto) {
    return this.fieldsService.createField(userId, dto);
  }

  @Get()
  async findAll(@User("id") userId: string) {
    return this.fieldsService.getFieldsByUser(userId);
  }

  @Get(":id")
  async findOne(@User("id") userId: string, @Param("id") fieldId: string) {
    return this.fieldsService.findOneById(userId, fieldId);
  }
}
