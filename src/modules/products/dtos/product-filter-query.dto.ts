import {
  IsEnum,
  IsInt,
  IsOptional,
  //IsString,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
// استيراد الـ DTO العام
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';

export enum ProductSortBy {
  CREATED_AT = 'createdAt',
  PRICE = 'price',
  TITLE = 'title',
}

export class ProductFilterQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy?: ProductSortBy = ProductSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}
