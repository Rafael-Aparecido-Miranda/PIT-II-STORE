import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProductsRepository } from './products.repository';
import {
  CreateProductInput,
  CreateProductProps,
  DeleteProductProps,
  UpdateProductProps,
} from './interface/products.interface';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';

@Injectable()
export class ProductsService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  @Inject(ErrorHandlerService)
  private errorHandlerService: ErrorHandlerService;

  @Inject(ProductsRepository)
  private readonly productsRepository: ProductsRepository;

  async getProducts() {
    const cacheKey = 'products';

    const cachedProducts = await this.cacheService.get(cacheKey);

    if (cachedProducts) {
      return cachedProducts;
    }

    const response = await this.productsRepository.getProducts();

    await this.cacheService.set(cacheKey, response, { ttl: 10 });

    return response;
  }

  async getProductsByUserId(userId: string) {
    const cacheKey = `products-${userId}`;

    const cachedProducts = await this.cacheService.get(cacheKey);

    if (cachedProducts) {
      return cachedProducts;
    }

    const response = await this.productsRepository.getProductsByUserId(userId);

    await this.cacheService.set(cacheKey, response, { ttl: 10 });

    return response;
  }

  async createProduct(props: CreateProductProps) {
    const productCreateInput: CreateProductInput = {
      ...props,
      user: {
        connect: {
          id: props.user.id,
        },
      },
    };

    return this.productsRepository.createProduct(productCreateInput);
  }

  async updateProduct(props: UpdateProductProps) {
    if (!props.productId) {
      this.errorHandlerService.dispatch({
        message: 'Id do produto não informado',
        status: 404,
      });
    }

    const existingProduct = await this.productsRepository.getProductById(
      props.productId,
    );

    if (!existingProduct) {
      this.errorHandlerService.dispatch({
        message: 'Produto não encontrado',
        status: 404,
      });
    }

    return this.productsRepository.updateProduct(props);
  }

  async deleteProduct({ userId, productId }: DeleteProductProps) {
    return this.productsRepository.deleteProduct({
      userId,
      productId,
    });
  }
}
