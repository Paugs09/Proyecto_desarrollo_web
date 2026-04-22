import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDto, OrderItemDto } from '../interfaces/cart.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) { }

  syncItems(cartItem: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, cartItem);
  }

  createOrder(items: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, items);
  }

  finishOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/finish-order/${orderId}`, null);
  }

  listProductsOfCart(): Observable<OrderItemDto[]> {
    return this.http.get<OrderItemDto[]>(`${this.apiUrl}/items`);
  }
}