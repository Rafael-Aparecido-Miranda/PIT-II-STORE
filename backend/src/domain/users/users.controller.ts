import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard.guard';
import { AuthenticatedRequest } from './interface/users.interface';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/users.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  @Inject(UsersService)
  private userService: UsersService;

  @Get('')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getAccount(@Req() request: AuthenticatedRequest) {
    try {
      return request.user;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || 500,
          message: error.message,
        },
        error.status || 500,
      );
    }
  }

  @Post('create')
  @HttpCode(201)
  async createAccount(@Body() data: CreateUserDto) {
    try {
      await this.userService.createUser(data);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || 500,
          message: error.message,
        },
        error.status || 500,
      );
    }
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() data: LoginUserDto) {
    try {
      const token = await this.userService.login(data);

      return {
        token,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || 500,
          message: error.message,
        },
        error.status || 500,
      );
    }
  }
}
