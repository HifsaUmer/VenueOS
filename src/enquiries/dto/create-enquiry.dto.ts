import { IsString, IsOptional, IsNotEmpty, IsIn } from 'class-validator';

export class CreateEnquiryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  briefText?: string;

  // ✅ Add status field (optional for creation)
  @IsOptional()
  @IsString()
  @IsIn(['RECEIVED', 'PROPOSAL_SENT', 'ACCEPTED', 'REJECTED'])
  status?: string;
}