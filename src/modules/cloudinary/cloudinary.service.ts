import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryDestroyResponse } from './types/cloudinary.interface';

type CloudinaryInstance = typeof cloudinary;

@Injectable()
export class CloudinaryService {
  private readonly cloudinary: CloudinaryInstance;

  constructor(private config: ConfigService) {
    this.cloudinary = cloudinary;

    this.cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'ecommerce',
  ): Promise<{ url: string; publicId: string }> {
    try {
      return await new Promise((resolve, reject) => {
        const upload = this.cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result) {
              return reject(
                new Error(error?.message ?? 'Cloudinary upload failed'),
              );
            }

            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          },
        );

        upload.end(file.buffer);
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Cloudinary upload failed');
    }
  }

  async uploadMultiple(files: Express.Multer.File[], folder = 'ecommerce') {
    const results = [];

    for (const file of files) {
      const uploaded = await this.uploadImage(file, folder);
      results.push(uploaded);
    }

    return results;
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const res = (await this.cloudinary.uploader.destroy(
        publicId,
      )) as CloudinaryDestroyResponse;

      return res.result === 'ok';
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete image');
    }
  }
}
