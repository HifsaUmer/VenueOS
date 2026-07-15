import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateEquipmentDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  rentalPrice: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}