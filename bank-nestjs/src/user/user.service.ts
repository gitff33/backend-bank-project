import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { generateFakeCardData } from '../utils/generate.card';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const cardData = generateFakeCardData();

    return await this.prisma.$transaction(async (tx) => {
      // существует ли такой юзер?
      const existingUser = await tx.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException(
          'Пользователь с таким Email уже существует!',
        );
      }

      return tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          FirstName: dto.FirstName,
          LastName: dto.LastName,
          accounts: {
            create: [
              {
                balance: 100.0,
                cards: {
                  create: {
                    number: cardData.cardNumber,
                    expDate: cardData.expDate,
                    cvv: cardData.cvv,
                  },
                },
              },
            ],
          },
        },
        include: {
          accounts: {
            include: {
              cards: true,
            },
          },
        },
      });
    });
  }

  async createCardForAccount(userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { userId },
    });

    if (!account) {
      throw new NotFoundException('Аккаунт не найден');
    }

    const cardData = generateFakeCardData();

    return await this.prisma.card.create({
      data: {
        accountId: account.id,
        number: cardData.cardNumber,
        expDate: cardData.expDate,
        cvv: cardData.cvv,
      },
    });
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('неверный email или пароль...');
    }
    const isPasswordQuals = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordQuals) {
      throw new NotFoundException('неверный email или пароль');
    }
    return user;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('такого юзера нету в базе');
    }
    return user;
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        FirstName: true,
        LastName: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          include: {
            cards: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('пользователь с такой почтой не найден');
    }
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('пользователь не найден');
    }
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }
  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('пользователь не найден,проверьте айди!');
    }
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
  async getTotalBalance(id: string) {
    await this.findOne(id);

    const aggregation = await this.prisma.account.aggregate({
      where: { userId: id },
      _sum: {
        balance: true,
      },
    });
    return {
      userId: id,
      totalBalance: aggregation._sum.balance || 0,
    };
  }
}
