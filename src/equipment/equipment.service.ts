import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    return this.prisma.equipment.create({
      data: {
        name: createEquipmentDto.name,
        category: createEquipmentDto.category,
        description: createEquipmentDto.description,
        quantity: createEquipmentDto.quantity,
        rentalPrice: createEquipmentDto.rentalPrice,
        isAvailable: createEquipmentDto.isAvailable ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.equipment.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
    });

    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    return equipment;
  }

  async update(id: string, updateEquipmentDto: UpdateEquipmentDto) {
    await this.findOne(id);
    return this.prisma.equipment.update({
      where: { id },
      data: updateEquipmentDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.equipment.delete({
      where: { id },
    });
  }

  async checkAvailability(id: string, quantity: number, date: string) {
    const equipment = await this.findOne(id);

    // Check if enough quantity is available through bookingEquipment relation
    const bookings = await this.prisma.booking.findMany({
      where: {
        date: new Date(date),
        status: { not: 'CANCELLED' },
      },
      include: {
        bookingEquipment: {
          include: {
            equipment: true,
          },
        },
      },
    });

    let totalBooked = 0;
    bookings.forEach((booking) => {
      booking.bookingEquipment.forEach((be) => {
        if (be.equipmentId === id) {
          totalBooked += be.quantity;
        }
      });
    });

    const available = equipment.quantity - totalBooked;

    return {
      equipmentId: id,
      equipmentName: equipment.name,
      totalQuantity: equipment.quantity,
      bookedQuantity: totalBooked,
      availableQuantity: available,
      isAvailable: available >= quantity,
    };
  }
}