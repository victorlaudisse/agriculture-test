import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { CreateFieldDto } from "./fields.dto";
import { FieldsService } from "./fields.service";

import { AuthGuard } from "@/auth/auth.guard";
import { User } from "@/auth/user.decorator";

@Controller("fields")
export class FieldsController {
  constructor(private fieldsService: FieldsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@User("id") userId: string, @Body() dto: CreateFieldDto) {
    return this.fieldsService.createField(userId, dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@User("id") userId: string) {
    return this.fieldsService.getFieldsByUser(userId);
  }
}
