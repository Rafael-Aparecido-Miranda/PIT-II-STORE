import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedRequest } from 'src/domain/users/interface/users.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';


describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  const mockProductsService = {
    getProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const result = [{ id: 1, name: 'Product 1' }];
      jest.spyOn(productsService, 'getProducts').mockResolvedValue(result);

      expect(await productsController.getProducts()).toBe(result);
    });

    it('should throw an HttpException on error', async () => {
      jest.spyOn(productsService, 'getProducts').mockRejectedValue(new Error('Error'));

      await expect(productsController.getProducts()).rejects.toThrow(HttpException);
    });
  });


  describe('createProduct', () => {
    it('should create a product', async () => {
      const request = { user: { id: 1 } } as AuthenticatedRequest;
      const createProductDto: CreateProductDto = { name: 'Product 1' };
      jest.spyOn(productsService, 'createProduct').mockResolvedValue(undefined);

      await productsController.createProduct(createProductDto, request);

      expect(productsService.createProduct).toHaveBeenCalledWith({
        ...createProductDto,
        user: request.user,
      });
    });

    it('should throw an HttpException on error', async () => {
      const request = { user: { id: 1 } } as AuthenticatedRequest;
      const createProductDto: CreateProductDto = { name: 'Product 1' };
      jest.spyOn(productsService, 'createProduct').mockRejectedValue(new Error('Error'));

      await expect(productsController.createProduct(createProductDto, request)).rejects.toThrow(HttpException);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const request = { user: { id: 1 } } as AuthenticatedRequest;
      const updateProductDto: UpdateProductDto = { id: 1, name: 'Updated Product' };
      jest.spyOn(productsService, 'updateProduct').mockResolvedValue(undefined);

      await productsController.updateProduct(updateProductDto, request);

      expect(productsService.updateProduct).toHaveBeenCalledWith({
        userId: request.user.id,
        ...updateProductDto,
      });
    });

    it('should throw an HttpException on error', async () => {
      const request = { user: { id: 1 } } as AuthenticatedRequest;
      const updateProductDto: UpdateProductDto = { id: 1, name: 'Updated Product' };
      jest.spyOn(productsService, 'updateProduct').mockRejectedValue(new Error('Error'));

      await expect(productsController.updateProduct(updateProductDto, request)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteProduct', 
  () => {
    it('should delete a product', async () => {
      const request = { user: { id: 1 } } as AuthenticatedRequest;
      const productId = '1';
      jest.spyOn(productsService, 'deleteProduct').mockResolvedValue(undefined);

      await productsController.deleteProduct(request, productId);

      expect(productsService.deleteProduct).toHaveBeenCalledWith({
        userId: request.user.id,
        productId,
      });
    });

    it('should throw an HttpException on error', async () => {
      const request = { user: { id: 1 } } as AuthenticatedRequest;
      const productId = '1';
      jest.spyOn(productsService, 'deleteProduct').mockRejectedValue(new Error('Error'));

      await expect(productsController.deleteProduct(request, productId)).rejects.toThrow(HttpException);
    });
  });
});