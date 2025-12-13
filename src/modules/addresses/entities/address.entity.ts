// src/modules/addresses/entities/address.entity.ts

import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'addresses' })
export class Address extends BaseEntity {
  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  postalCode: string;

  // العلاقة مع المستخدم
  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;
}
