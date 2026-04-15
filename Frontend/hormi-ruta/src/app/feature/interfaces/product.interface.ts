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
  displayOrder: number; // Agregado según tu JSON
}

export interface ProductVariant {
  id: number;
  sku: string;           // ¡Esta es la que faltaba!
  specificPrice: number;
  stock: number;
  images: ProductImage[];
  values: VariantValue[]; 
}

export interface VariantValue {
  attributeName: string;
  value: string;
}