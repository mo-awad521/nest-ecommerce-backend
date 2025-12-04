import { Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('wishlists')
@Unique(['user', 'product'])
export class Wishlist extends BaseEntity {
  @ManyToOne(() => User, (user: User) => user.wishlist, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Product, (product) => product.wishlist, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
