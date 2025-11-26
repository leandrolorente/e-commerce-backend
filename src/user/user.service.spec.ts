import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    address: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser = {
    id: 'user-1',
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'hashedpassword',
    phone: '11999999999',
    avatar: 'https://i.pravatar.cc/150?img=1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('deve retornar o perfil do usuário', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfile('user-1');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
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
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('deve atualizar o perfil do usuário', async () => {
      const updateDto = {
        name: 'João Silva Updated',
        phone: '11988888888',
      };

      const updatedUser = {
        id: 'user-1',
        name: 'João Silva Updated',
        email: 'joao@example.com',
        phone: '11988888888',
        role: 'USER',
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('user-1', updateDto);

      expect(result.name).toBe('João Silva Updated');
      expect(result.phone).toBe('11988888888');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: updateDto,
        select: expect.any(Object),
      });
    });

    it('deve atualizar apenas campos fornecidos', async () => {
      const updateDto = { name: 'Novo Nome' };
      const updatedUser = {
        id: 'user-1',
        name: 'Novo Nome',
        email: 'joao@example.com',
        phone: '11999999999',
        role: 'USER',
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('user-1', updateDto);

      expect(result.name).toBe('Novo Nome');
    });
  });

  describe('changePassword', () => {
    it('deve alterar a senha com sucesso', async () => {
      const changePasswordDto = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashedpassword');
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        password: 'newhashedpassword',
      });

      await service.changePassword('user-1', changePasswordDto);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'oldpassword',
        'hashedpassword',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException se senha atual estiver incorreta', async () => {
      const changePasswordDto = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('user-1', changePasswordDto),
      ).rejects.toThrow('Senha atual incorreta');
    });
  });

  describe('getAddresses', () => {
    it('deve retornar array vazio pois funcionalidade não está implementada', async () => {
      const result = await service.getAddresses('user-1');
      
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('setDefaultAddress', () => {
    it('deve lançar exceção pois funcionalidade não está implementada', async () => {
      await expect(
        service.setDefaultAddress('user-1', 'address-1'),
      ).rejects.toThrow('Funcionalidade de endereços será implementada em breve');
    });
  });
});
