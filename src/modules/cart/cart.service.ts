import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

import { AddToCartDto } from './dtos/add-to-cart.dto';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // ---------------------------------------------------
  // GET OR CREATE CART
  // ---------------------------------------------------
  private async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.images'],
    });

    if (!cart) {
      cart = this.cartRepo.create({
        user: { id: userId },
        items: [],
      });

      cart = await this.cartRepo.save(cart);
    }

    return cart;
  }

  // ---------------------------------------------------
  // GET CART
  // ---------------------------------------------------
  async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0,
    );

    return {
      id: cart.id,
      userId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      totalItems,
      totalPrice,
      items: cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        productId: item.product.id,
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          images: item.product.images.map((img) => ({ url: img.url })),
        },
      })),
    };
  }

  // ---------------------------------------------------
  // ADD TO CART
  // ---------------------------------------------------
  async addToCart(userId: number, dto: AddToCartDto) {
    const cart = await this.getOrCreateCart(userId);

    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
      relations: ['images'],
    });

    if (!product) throw new NotFoundException('Product not found');

    const existingItem = cart.items.find((i) => i.product.id === dto.productId);

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      await this.cartItemRepo.save(existingItem);
    } else {
      const newItem = this.cartItemRepo.create({
        cart,
        product,
        quantity: dto.quantity,
      });
      await this.cartItemRepo.save(newItem);
    }

    return this.getCart(userId);
  }

  // ---------------------------------------------------
  // UPDATE CART ITEM
  // ---------------------------------------------------
  async updateItem(userId: number, itemId: number, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) throw new NotFoundException('Cart item not found');

    if (dto.quantity) item.quantity = dto.quantity;

    await this.cartItemRepo.save(item);

    return this.getCart(userId);
  }

  // ---------------------------------------------------
  // REMOVE CART ITEM
  // ---------------------------------------------------
  async removeItem(userId: number, itemId: number) {
    const cart = await this.getOrCreateCart(userId);

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Cart item not found');

    await this.cartItemRepo.remove(item);

    return this.getCart(userId);
  }

  // ---------------------------------------------------
  // CLEAR CART
  // ---------------------------------------------------
  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    await this.cartItemRepo.delete({ cart: { id: cart.id } });

    return this.getCart(userId);
  }
}
