import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import slugify from 'slugify';

import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { Category } from '../categories/entities/category.entity';

import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
//import { PaginatedResponseDto } from '../../common/dtos/paginated-response.dto';
//import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import { paginate } from '../../common/pagination/paginate';
import { ProductFilterQueryDto } from './dtos/product-filter-query.dto';
import { PaginatedResult } from '../../common/dtos/paginated-result.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =====================================
  // CREATE PRODUCT
  // =====================================
  async create(
    dto: CreateProductDto,
    files?: Express.Multer.File[],
  ): Promise<Product> {
    let category: Category | undefined;
    if (dto.categoryId) {
      const foundCategory = await this.categoryRepo.findOne({
        where: { id: dto.categoryId },
      });
      if (!foundCategory) throw new NotFoundException('Category not found');
      category = foundCategory;
    }

    const slug = slugify(dto.title, { lower: true, strict: true });

    const product = this.productRepo.create({
      title: dto.title,
      slug,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      category,
    });

    const savedProduct = await this.productRepo.save(product);

    // ======= Upload images to Cloudinary =======
    if (files && files.length > 0) {
      const uploadedImages = await Promise.all(
        files.map(async (file, index) => {
          const { url, publicId } =
            await this.cloudinaryService.uploadImage(file);
          return this.imageRepo.create({
            url,
            publicId,
            isPrimary: index === 0,
            product: savedProduct,
          });
        }),
      );

      const savedImages = await this.imageRepo.save(uploadedImages);
      savedProduct.images = savedImages;
    }

    return savedProduct;
  }

  // =====================================
  // GET ALL
  // =====================================
  async findAll(
    filters: ProductFilterQueryDto,
  ): Promise<PaginatedResult<Product>> {
    const {
      page,
      limit,
      search,
      categoryId,
      inStock,
      sortBy,
      order,
      minPrice,
      maxPrice,
    } = filters;

    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images');

    if (search) {
      queryBuilder.andWhere(
        '(product.title LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (inStock === true) {
      queryBuilder.andWhere('product.stock > 0');
    } else if (inStock === false) {
      queryBuilder.andWhere('product.stock = 0');
    }

    const validSortFields = ['createdAt', 'price', 'title'];
    const finalSortBy = validSortFields.includes(sortBy!)
      ? `product.${sortBy}`
      : 'product.createdAt';
    const finalOrder = order || 'DESC';

    queryBuilder.orderBy(finalSortBy, finalOrder);

    return paginate<Product>(queryBuilder, page, limit);
  }

  // async findAll(): Promise<Product[]> {
  //   return this.productRepo.find({
  //     relations: ['images', 'category'],
  //     order: { createdAt: 'DESC' },
  //   });
  // }
  //---------------------------------------------

  // =====================================
  // GET ONE
  // =====================================
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['images', 'category'],
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  // =====================================
  // UPDATE
  // =====================================
  async update(
    id: number,
    dto: UpdateProductDto,
    files?: Express.Multer.File[],
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    product.title = dto.title ?? product.title;
    product.description = dto.description ?? product.description;
    product.price = dto.price ?? product.price;
    product.stock = dto.stock ?? product.stock;
    product.slug = slugify(product.title, { lower: true, strict: true });

    // ========== images update ==========
    if (files && files.length > 0) {
      for (const image of product.images) {
        if (image.publicId) {
          await this.cloudinaryService.deleteImage(image.publicId);
        }
      }
      await this.imageRepo.delete({ product: { id } });

      const uploadedImages = await Promise.all(
        files.map(async (file, index) => {
          const uploadResult = await this.cloudinaryService.uploadImage(file);
          return this.imageRepo.create({
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            isPrimary: index === 0,
            product,
          });
        }),
      );

      const savedImages = await this.imageRepo.save(uploadedImages);
      product.images = savedImages;
    }

    return this.productRepo.save(product);
  }

  // =====================================
  // UPDATE IMAGES
  // =====================================
  async updateImages(
    productId: number,
    files: Express.Multer.File[],
    uploadResults: { url: string }[],
  ): Promise<Product> {
    const product = await this.findOne(productId);

    await this.imageRepo.delete({ product: { id: productId } });

    const newImages = uploadResults.map((img, idx) =>
      this.imageRepo.create({
        url: img.url,
        isPrimary: idx === 0,
        product: { id: productId } as Product,
      }),
    );

    const savedImages = await this.imageRepo.save(newImages);
    product.images = savedImages;

    return product;
  }

  // =====================================
  // DELETE
  // =====================================
  async remove(id: number): Promise<{ deleted: boolean }> {
    const product = await this.findOne(id);
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (img) => {
          if (img.publicId) {
            await this.cloudinaryService.deleteImage(img.publicId);
          }
        }),
      );
    }
    await this.productRepo.remove(product);
    return { deleted: true };
  }
  // =====================================
  // Find Many Products by Ids
  // =====================================
  findManyByIds(ids: number[]) {
    return this.productRepo.find({
      where: { id: In(ids) },
      relations: ['images'],
    });
  }
}
