import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('proposals')
@Controller('proposals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @Roles(UserRole.COORDINATOR)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Proposal created successfully' })
  @ApiOperation({ summary: 'Create a new proposal (Coordinator only)' })
  create(
    @Body() createProposalDto: CreateProposalDto,
    @CurrentUser() user: User,
  ) {
    return this.proposalsService.create(createProposalDto, user.id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get all proposals' })
  @ApiOperation({ summary: 'Get all proposals' })
  findAll(@CurrentUser() user: User) {
    return this.proposalsService.findAll(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get proposal by id' })
  @ApiOperation({ summary: 'Get proposal by id' })
  findOne(@Param('id') id: string) {
    return this.proposalsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update proposal' })
  @ApiOperation({ summary: 'Update proposal' })
  update(
    @Param('id') id: string,
    @Body() updateProposalDto: UpdateProposalDto,
  ) {
    return this.proposalsService.update(id, updateProposalDto);
  }

  @Patch(':id/accept')
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Accept proposal' })
  @ApiOperation({ summary: 'Accept proposal (Client only)' })
  accept(@Param('id') id: string, @CurrentUser() user: User) {
    return this.proposalsService.acceptProposal(id, user.id);
  }

  @Patch(':id/reject')
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Reject proposal' })
  @ApiOperation({ summary: 'Reject proposal (Client only)' })
  reject(@Param('id') id: string, @CurrentUser() user: User) {
    return this.proposalsService.rejectProposal(id, user.id);
  }

  @Patch(':id/send')
  @Roles(UserRole.COORDINATOR)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Send proposal' })
  @ApiOperation({ summary: 'Send proposal to client' })
  send(@Param('id') id: string) {
    return this.proposalsService.sendProposal(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete proposal' })
  @ApiOperation({ summary: 'Delete proposal' })
  remove(@Param('id') id: string) {
    return this.proposalsService.remove(id);
  }
}