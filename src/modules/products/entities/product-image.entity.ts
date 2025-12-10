// src/modules/products/entities/product-image.entity.ts

import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage extends BaseEntity {
  @Column()
  url: string;

  @Column({ default: false })
  isPrimary: boolean;

  @Column()
  publicId: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
