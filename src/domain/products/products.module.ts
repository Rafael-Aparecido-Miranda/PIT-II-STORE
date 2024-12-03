import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { UsersRepository } from '../users/users.repository';
import { ProductsController } from './products.controller';

@Module({
  imports: [InfraModule],
  providers: [
    ProductsService,
    ProductsRepository,
    UsersRepository,
    PrismaService,
    ErrorHandlerService,
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
