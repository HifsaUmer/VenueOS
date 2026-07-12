import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  eventId: string;

  @ApiProperty()
  @IsString()
  spaceId: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsString()
  endTime: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  guestCount: number;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  equipmentIds?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  equipmentQuantities?: number[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  vendorIds?: string[];

  @ApiProperty({ enum: BookingStatus, default: BookingStatus.PENDING })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}