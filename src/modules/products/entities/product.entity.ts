// src/modules/products/entities/product.entity.ts

import { Column, Entity, ManyToOne, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from './product-image.entity';
import { Review } from '../../reviews/entities/review.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0, type: 'float' })
  avgRating: number;

  // ========== RELATIONS ==========

  // Category -> Product (Many-to-One)
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Index()
  category?: Category;

  // Product -> Images (One-to-Many)
  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
  })
  images: ProductImage[];

  // Product -> Reviews (One-to-Many)
  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  // Product -> OrderItems
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  // Product -> CartItems
  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  // Product -> Wishlists
  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlist: Wishlist[];
}
