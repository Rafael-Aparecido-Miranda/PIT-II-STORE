import { Prisma } from '@prisma/client';
import { UserTypes } from 'src/domain/users/interface/users.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export type CreateProductInput = Prisma.ProductCreateInput;

export interface CreateProductProps extends CreateProductDto {
  user: UserTypes;
}

export interface DeleteProductProps {
  userId: string;
  productId: string;
}

export type DeleteProductInput = DeleteProductProps;

export type UpdateProductProps = {
  userId: string;
} & UpdateProductDto;

export type UpdateProductInput = UpdateProductProps;
