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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.FINANCE, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Payment created successfully' })
  @ApiOperation({ summary: 'Create a new payment' })
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: User,
  ) {
    return this.paymentsService.create(createPaymentDto, user.id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get all payments' })
  @ApiOperation({ summary: 'Get all payments' })
  findAll(@CurrentUser() user: User) {
    return this.paymentsService.findAll(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get payment by id' })
  @ApiOperation({ summary: 'Get payment by id' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.FINANCE, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update payment' })
  @ApiOperation({ summary: 'Update payment' })
  update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete payment' })
  @ApiOperation({ summary: 'Delete payment' })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
