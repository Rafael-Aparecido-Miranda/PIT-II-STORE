import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import {
  CreateProductInput,
  DeleteProductInput,
  UpdateProductInput,
} from './interface/products.interface';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { ErrorStatus } from 'src/infra/error-handler/error-handler.interface';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  @Inject(ErrorHandlerService)
  private errorHandlerService: ErrorHandlerService;

  async getProducts() {
    try {
      const products = await this.prisma.product.findMany();

      return products;
    } catch (error) {
      console.error(error);

      this.errorHandlerService.dispatch({
        message: 'Erro ao buscar produtos',
        status: ErrorStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getProductById(productId: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      return product;
    } catch (error) {
      console.error(error);

      this.errorHandlerService.dispatch({
        message: 'Produto não encontrado',
        status: ErrorStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getProductsByUserId(userId: string) {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          userId,
        },
      });

      return products;
    } catch (error) {
      console.error(error);

      this.errorHandlerService.dispatch({
        message: 'Produtos não encontrados',
        status: ErrorStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createProduct(data: CreateProductInput) {
    try {
      const response = await this.prisma.product.create({
        data,
      });

      return response;
    } catch (error) {
      console.error(error);

      this.errorHandlerService.dispatch({
        message: 'Erro ao criar o produto',
        status: ErrorStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateProduct(data: UpdateProductInput) {
    try {
      const dataWithoutAccountAndProductId = {
        ...data,
        accountId: undefined,
        productId: undefined,
      };

      const response = await this.prisma.product.update({
        where: {
          id: data.productId,
          userId: data.userId,
        },
        data: {
          ...dataWithoutAccountAndProductId,
        },
      });

      return response;
    } catch (error) {
      console.error(error);

      this.errorHandlerService.dispatch({
        message: 'Erro ao atualizar o produto',
        status: ErrorStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteProduct({ userId, productId }: DeleteProductInput) {
    try {
      const response = await this.prisma.product.delete({
        where: {
          id: productId,
          userId,
        },
      });

      return response;
    } catch (error) {
      console.error(error);

      this.errorHandlerService.dispatch({
        message: 'Erro ao deletar o produto',
        status: ErrorStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
