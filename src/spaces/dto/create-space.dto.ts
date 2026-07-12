import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpaceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string; // Conference Hall, Banquet Hall, Rooftop, Garden, Boardroom

  @ApiProperty()
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  hourlyRate: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  amenities?: string; // JSON string of amenities

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  requiresDeposit?: boolean;
}