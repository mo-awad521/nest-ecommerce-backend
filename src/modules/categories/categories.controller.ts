// src/modules/categories/categories.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/role.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // -----------------------------
  // CREATE CATEGORY (Admin only)
  // -----------------------------
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @ResponseMessage('Category created successfully')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  // -----------------------------
  // GET ALL
  // -----------------------------
  @Get()
  @ResponseMessage('Categories fetched successfully')
  findAll() {
    return this.categoriesService.findAll();
  }

  // -----------------------------
  // GET ONE
  // -----------------------------
  @Get(':id')
  @ResponseMessage('Category fetched successfully')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  // -----------------------------
  // UPDATE (Admin only)
  // -----------------------------
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  @ResponseMessage('Category updated successfully')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  // -----------------------------
  // DELETE (Admin only)
  // -----------------------------
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  @ResponseMessage('Category deleted successfully')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
