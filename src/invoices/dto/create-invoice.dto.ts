import { IsString, IsUUID, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsUUID()
  eventId: string;

  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDateString()
  dueDate: string;
}