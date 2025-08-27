import { IsNumber, IsString, Max, Min } from "class-validator";

export class CreateFieldDto {
  @IsString()
  name!: string;

  @IsString()
  crop!: string;

  @IsNumber()
  @Min(0)
  area!: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;
}
