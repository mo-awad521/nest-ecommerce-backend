// src/modules/categories/entities/category.entity.ts

import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  // علاقة 1 : N مع المنتجات
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
