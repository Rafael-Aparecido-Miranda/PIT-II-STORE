import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { EncryptService } from 'src/infra/encrypt/encrypt.service';
import { AccountsController } from './users.controller';
import { InfraModule } from 'src/infra/infra.module';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [InfraModule],
  controllers: [AccountsController],
  providers: [
    PrismaService,
    EncryptService,
    UsersRepository,
    UsersService,
    ErrorHandlerService,
  ],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
