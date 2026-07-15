import { PartialType } from '@nestjs/swagger';
import { CreateEnquiryDto } from './create-enquiry.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateEnquiryDto extends PartialType(CreateEnquiryDto) {
  // ✅ Explicitly add status field
  @IsOptional()
  @IsString()
  @IsIn(['RECEIVED', 'PROPOSAL_SENT', 'ACCEPTED', 'REJECTED'])
  status?: string;
}