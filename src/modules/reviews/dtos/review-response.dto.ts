export class ReviewResponseDto {
  id: number;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;

  userId: number;
  productId: number;
}
