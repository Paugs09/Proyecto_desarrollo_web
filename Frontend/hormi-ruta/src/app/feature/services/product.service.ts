import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductDetail } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
 
  private apiUrl = 'https://localhost:44384/api/product'; 

  constructor(private http: HttpClient) {}
 // /detail/{id}
  getById(id: number) {
    return this.http.get<ProductDetail>(`${this.apiUrl}/detail/${id}`);
  }
}