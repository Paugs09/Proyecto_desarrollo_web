import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Importante añadir esto
import { ProductDetail } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  
  private apiUrl = 'https://localhost:44384/api/product'; 

  constructor(private http: HttpClient) {}

  // Obtener detalle del producto
  getById(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.apiUrl}/detail/${id}`);
  }

  // Guardar o quitar de Favoritos
  toggleFavorite(variantId: number, isFav: boolean): Observable<any> {
    const body = {
      productVariantId: variantId,
      isFavorite: isFav
    };
    return this.http.post(`${this.apiUrl}/wish-list`, body);
  }
}