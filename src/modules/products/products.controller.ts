import {
  Controller,
  Get,
  Post,
  //Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
  Put,
} from '@nestjs/common';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

import { AdminGuard } from '../../common/guards/admin.guard';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // =============================
  // CREATE PRODUCT
  // =============================

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ResponseMessage('Product created successfully')
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.create(dto, files);
  }
  // =============================
  // GET ALL PRODUCTS
  // =============================
  @Get()
  @ResponseMessage('Products fetched successfully')
  async findAll() {
    return this.productsService.findAll();
  }

  // =============================
  // GET ONE PRODUCT
  // =============================
  @Get(':id')
  @ResponseMessage('Product fetched successfully')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // =============================
  // UPDATE PRODUCT
  // =============================
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 5))
  @ResponseMessage('Product updated successfully')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.update(id, dto, files);
  }

  // =============================
  // UPDATE IMAGES (CLOUDINARY)
  // =============================
  // @UseGuards(AdminGuard, JwtAuthGuard)
  // @Patch(':id/images')
  // @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  // @ResponseMessage('Product images updated successfully')
  // async uploadImages(
  //   @Param('id', ParseIntPipe) id: number,
  //   @UploadedFiles() files: Express.Multer.File[],
  //   uploadResults: { url: string }[],
  // ) {
  //   return this.productsService.updateImages(id, files, uploadResults);
  // }

  // =============================
  // DELETE PRODUCT
  // =============================
  @UseGuards(AdminGuard, JwtAuthGuard)
  @Delete(':id')
  @ResponseMessage('Product deleted successfully')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
