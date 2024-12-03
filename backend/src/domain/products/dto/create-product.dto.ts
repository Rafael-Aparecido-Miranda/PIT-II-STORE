import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export type ProductCreateInput = Prisma.ProductCreateInput;

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  description?: string;
}
