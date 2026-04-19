import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
import { ProductDetail, ProductDto } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  
  private apiUrl = 'https://localhost:44384/api/product'; 

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.apiUrl}/detail/${id}`);
  }

  // Obtiene la lista de favoritos actual
  getWishList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/wish-list`);
  }

  // Envía la acción de favorito con el booleano
  toggleFavorite(variantId: number, isFav: boolean): Observable<any> {
    const body = {
      productVariantId: variantId,
      isFavorite: isFav
    };
    return this.http.post(`${this.apiUrl}/wish-list`, body);
  }

  //crear producto
  createProduct(productData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/product`, productData);
}
uploadImage(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file); 

  
  return this.http.post(`${this.apiUrl}/upload-image`, formData, { 
    responseType: 'text' 
  });
}

  //Listar productos
  getAll(categoryId?: number, productName?: string): Observable<ProductDto[]> {
    let params: any = {};
    if (categoryId) params['categoryId'] = categoryId;
    if (productName) params['productName'] = productName;

    return this.http.get<ProductDto[]>(this.apiUrl, { params });
  }

}