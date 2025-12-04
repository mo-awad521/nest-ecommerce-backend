export class CartItemResponseDto {
  id: number;
  productId: number;
  quantity: number;

  product?: {
    id: number;
    title: string;
    price: number;

    images: { url: string }[];
  };
}
