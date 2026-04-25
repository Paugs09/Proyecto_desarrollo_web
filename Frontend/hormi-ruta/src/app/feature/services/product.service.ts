import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BestSellerDto, ProductDetail, ProductDto } from '../interfaces/product.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getById(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.apiUrl}/product/detail/${id}`);
  }

  // Obtiene la lista de favoritos actual
  getWishList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product/wish-list`);
  }

  // Envía la acción de favorito con el booleano
  toggleFavorite(productId: number, isFav: boolean): Observable<any> {
    const body = {
      productId: productId,
      isFavorite: isFav
    };
    return this.http.post(`${this.apiUrl}/product/wish-list`, body);
  }

  // METODOS PARA EL FORMULARIO 
  createProduct(productData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/product`, productData);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product/${productId}`);
  }

  updateProduct(productId: number, productData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/product/${productId}`, productData);
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('formFile', file, file.name);
    return this.http.post(`${this.apiUrl}/product/upload-image`, formData, {
      responseType: 'text'
    });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/common/category-presentation`);
  }

  getMunicipalities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/common/parameter/municipality`);
  }

  getMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/common/parameter/material`);
  }
  getAttributes(): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/common/parameter/attribute`);
  }

  // Listar productos
  getAll(categoryId?: number, productName?: string): Observable<ProductDto[]> {
    let params: any = {};
    if (categoryId) params['categoryId'] = categoryId;
    if (productName) params['productName'] = productName;

    return this.http.get<ProductDto[]>(`${this.apiUrl}/product`, { params });
  }

  // Top vendidos
  getBestSellers(): Observable<BestSellerDto[]> {
    return this.http.get<BestSellerDto[]>(`${this.apiUrl}/product/best-sellers`);
  }

  getPurchaseHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product/purchase-history`);
  }
}