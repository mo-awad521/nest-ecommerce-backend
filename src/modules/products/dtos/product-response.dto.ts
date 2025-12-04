import { ProductImageResponseDto } from './product-image.dto';

export class ProductResponseDto {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  avgRating: number;
  createdAt: Date;

  categoryId?: number;

  images: ProductImageResponseDto[];
}
