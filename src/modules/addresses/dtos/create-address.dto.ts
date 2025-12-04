import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAddressDto {
  @IsNumber()
  userId: number;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;
}
