import { Entity, Column, OneToMany, OneToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../../common/enums/role.enum';
import { Address } from '../../addresses/entities/address.entity';
import { Order } from '../../orders/entities/order.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  verificationTokenExpires?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resetPasswordToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires?: Date;

  // -------- relations --------

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
