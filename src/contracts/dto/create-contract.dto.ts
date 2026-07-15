import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
  @ApiProperty()
  @IsUUID()
  proposalId: string;

  @ApiProperty()
  @IsString()
  content: string;
}