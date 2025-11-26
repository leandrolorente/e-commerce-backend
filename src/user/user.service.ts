import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  CreateAddressDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateProfileDto,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  async getAddresses(userId: string) {
    // Como não temos tabela Address no schema, vamos retornar array vazio
    // Você pode adicionar ao schema depois se precisar
    return [];
  }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    // Implementar quando adicionar tabela Address ao schema
    throw new BadRequestException(
      'Funcionalidade de endereços será implementada em breve',
    );
  }

  async deleteAddress(userId: string, addressId: string) {
    // Implementar quando adicionar tabela Address ao schema
    throw new BadRequestException(
      'Funcionalidade de endereços será implementada em breve',
    );
  }

  async setDefaultAddress(userId: string, addressId: string) {
    // Implementar quando adicionar tabela Address ao schema
    throw new BadRequestException(
      'Funcionalidade de endereços será implementada em breve',
    );
  }
}
