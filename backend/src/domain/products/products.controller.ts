import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
  Get,
  Delete,
  Param,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../users/interface/users.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  @HttpCode(200)
  async getProducts() {
    try {
      const response = await this.productsService.getProducts();

      return response;
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

  @Get('get_by_user')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getProductsByUserId(@Req() request: AuthenticatedRequest) {
    try {
      const response = await this.productsService.getProductsByUserId(
        request.user.id,
      );

      return response;
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
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      await this.productsService.createProduct({
        ...createProductDto,
        user: request.user,
      });
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

  @Patch('update')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      const props = {
        userId: request.user.id,
        ...updateProductDto,
      };

      await this.productsService.updateProduct(props);
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

  @Delete('delete/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteProduct(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    try {
      await this.productsService.deleteProduct({
        userId: request.user.id,
        productId: id,
      });
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
