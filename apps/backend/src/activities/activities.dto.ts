import { ActivityType } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateActivityDto {
  @IsEnum(ActivityType)
  type!: ActivityType;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
