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
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('contracts')
@Controller('contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @Roles(UserRole.COORDINATOR)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Contract created successfully' })
  @ApiOperation({ summary: 'Create a new contract (Coordinator only)' })
  create(
    @Body() createContractDto: CreateContractDto,
    @CurrentUser() user: User,
  ) {
    return this.contractsService.create(createContractDto, user.id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get all contracts' })
  @ApiOperation({ summary: 'Get all contracts' })
  findAll(@CurrentUser() user: User) {
    return this.contractsService.findAll(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get contract by id' })
  @ApiOperation({ summary: 'Get contract by id' })
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update contract' })
  @ApiOperation({ summary: 'Update contract' })
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(id, updateContractDto);
  }

  @Patch(':id/sign')
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Sign contract' })
  @ApiOperation({ summary: 'Sign contract (Client only)' })
  sign(@Param('id') id: string, @CurrentUser() user: User) {
    return this.contractsService.signContract(id, user.id);
  }

  @Patch(':id/send')
  @Roles(UserRole.COORDINATOR)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Send contract to client' })
  @ApiOperation({ summary: 'Send contract to client' })
  send(@Param('id') id: string) {
    return this.contractsService.sendContract(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete contract' })
  @ApiOperation({ summary: 'Delete contract' })
  remove(@Param('id') id: string) {
    return this.contractsService.remove(id);
  }
}