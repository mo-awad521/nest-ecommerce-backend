import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wishlist } from './entities/wishlist.entity';
import { AddToWishlistDto } from './dtos/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from './dtos/remove-from-wishlist.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Get user wishlist
   */
  async getWishlist(user: JwtPayload) {
    return this.wishlistRepo.find({
      where: { user: { id: user.sub } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Add item to wishlist
   */
  async addToWishlist(dto: AddToWishlistDto, user: JwtPayload) {
    const userEntity = await this.usersService.findById(user.sub);
    if (!userEntity) throw new NotFoundException('User not found');

    const product = await this.productsService.findOne(dto.productId);
    if (!product) throw new NotFoundException('Product not found');

    // Check if already exists
    const existing = await this.wishlistRepo.findOne({
      where: { user: { id: user.sub }, product: { id: dto.productId } },
    });

    if (existing) throw new ConflictException('Product already in wishlist');

    const wishlistItem = this.wishlistRepo.create({
      user: userEntity,
      product,
    });

    return this.wishlistRepo.save(wishlistItem);
  }

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(dto: RemoveFromWishlistDto, user: JwtPayload) {
    const item = await this.wishlistRepo.findOne({
      where: { user: { id: user.sub }, product: { id: dto.productId } },
    });

    if (!item) throw new NotFoundException('Item not found in wishlist');

    await this.wishlistRepo.remove(item);

    return { message: 'Removed successfully' };
  }
}
