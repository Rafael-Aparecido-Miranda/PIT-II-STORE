import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EncryptModule } from './encrypt/encrypt.module';
import { TokenModule } from './token/token.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ErrorHandlerModule } from './error-handler/error-handler.module';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: process.env.REDIS_DB || 0,
      ttl: 5000,
      max: 10,
      isGlobal: true,
    }),
    PrismaModule,
    EncryptModule,
    TokenModule,
    ErrorHandlerModule,
  ],
  exports: [PrismaModule, EncryptModule, TokenModule],
})
export class InfraModule {}
