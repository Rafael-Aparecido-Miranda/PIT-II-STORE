import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  type?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  productId: string;
}
