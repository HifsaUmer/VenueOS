import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    enum: ['RECEIVED', 'PROPOSAL_SENT', 'ACCEPTED', 'REJECTED'],
    description: 'New status for the enquiry',
  })
  @IsString()
  @IsIn(['RECEIVED', 'PROPOSAL_SENT', 'ACCEPTED', 'REJECTED'])
  status: string;
}