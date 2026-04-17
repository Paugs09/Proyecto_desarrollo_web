export interface OrderItemDto {
  productName: string;
  category: string;
  imageUrl: string;
  quantify: number;     
  unitPrice: number;
  totalAmountPerUnit: number;
}

export interface OrderDto {
  totalAmount: number;
  orderItems: OrderItemDto[];
}

export interface CreateOrderItemDto {
  productVariantId: number;
  quantity: number;
}