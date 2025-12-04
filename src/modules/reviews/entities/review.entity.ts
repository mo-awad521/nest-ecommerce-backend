import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @Column({ type: 'int', width: 1 })
  rating: number; // 1–5

  @Column({ nullable: true, type: 'varchar', length: 255 })
  title?: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
