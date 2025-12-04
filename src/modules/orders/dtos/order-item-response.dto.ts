export class OrderItemResponseDto {
  id: number;
  productId: number;
  quantity: number;
  price: number;

  product?: {
    id: number;
    title: string;
    price: number;
    images: { url: string }[];
  };
}
