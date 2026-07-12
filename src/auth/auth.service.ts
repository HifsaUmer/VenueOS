// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, phone, role } = registerDto;

    // Validate required fields
    if (!email || !password || !fullName) {
      throw new BadRequestException('Email, password, and full name are required');
    }

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password (ensure password is string)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with explicit types
    const user = await this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        fullName: fullName,
        phone: phone || null,
        role: role || UserRole.CLIENT,
        isActive: true,
      },
    });

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    // Remove password from response
    const { password: _, ...result } = user;
    return { user: result, token };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Validate required fields
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    // Remove password from response
    const { password: _, ...result } = user;
    return { user: result, token };
  }

  private generateToken(userId: string, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}