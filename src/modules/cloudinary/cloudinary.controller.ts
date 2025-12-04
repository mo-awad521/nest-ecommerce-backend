import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.cloudinaryService.uploadImage(file);
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.cloudinaryService.uploadMultiple(files);
  }

  @Delete('delete')
  async deleteImage(@Body('publicId') publicId: string) {
    return await this.cloudinaryService.deleteImage(publicId);
  }
}
