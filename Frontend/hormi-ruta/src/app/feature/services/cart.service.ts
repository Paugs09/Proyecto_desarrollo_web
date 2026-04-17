import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDto } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://localhost:44384/api/cart'; 

  constructor(private http: HttpClient) { }
   
  createOrder(items: any[], userId: string): Observable<any> {
    // Mandamos el array de items directamente y el ID por la URL 
    // Revisar
    return this.http.post(`${this.apiUrl}/create-order?userId=${userId}`, items);
  }

  listOrderItems(): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.apiUrl}/order-info`);
  }
}