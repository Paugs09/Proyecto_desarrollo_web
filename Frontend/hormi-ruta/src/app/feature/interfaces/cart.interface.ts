export interface OrderItemDto {
  productVariantId: number;
  productName: string;
  category: string;
  imageUrl: string;
  quantify: number;     
  unitPrice: number;
  totalAmountPerUnit: number;
  select?:boolean //Se gestiona en el front
}

export interface OrderDto {
  totalAmount: number;
  orderItems: OrderItemDto[];
}

export interface CreateOrderItemDto {
  productVariantId: number;
  quantity: number;
}