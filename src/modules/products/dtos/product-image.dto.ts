import { IsUrl } from 'class-validator';
export class ProductImageResponseDto {
  id: number;

  @IsUrl()
  url: string;
}
