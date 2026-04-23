export interface ProductDetail {
  id: number;
  productName: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  material: string;
  municipality: string;
  notes: string;
  dimensions: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number; 
}

export interface ProductVariant {
  id: number;
  sku: string;           
  specificPrice: number;
  stock: number;
  images: ProductImage[];
  values: VariantValue[]; 
}

export interface VariantValue {
  attributeName: string;
  value: string;
}

//Para el listado de productos
export interface ProductDto {
  id: number;
  name: string;
  shortDescription: string;
  basePrice: number;
  imageUrl: string;
  category?: string;
}

//Top vendidos
export interface BestSellerDto {
  productVariantId : number;
  productName : string;
  imageUrl: string;
  totalSales: number; 
}