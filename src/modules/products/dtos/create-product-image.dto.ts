import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;
}
