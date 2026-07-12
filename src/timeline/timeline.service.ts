<<<<<<< Updated upstream
import { Injectable } from '@nestjs/common';
=======
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimelineItemDto } from './dto/create-timeline-item.dto';
import { UpdateTimelineItemDto } from './dto/update-timeline-item.dto';
>>>>>>> Stashed changes

@Injectable()
export class TimelineService {}
