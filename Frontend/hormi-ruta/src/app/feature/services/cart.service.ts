import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { OrderDto } from '../interfaces/cart.interface';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://localhost:44384/api/cart'; // Asegúrate si es Cart o cart

  constructor(private http: HttpClient) { }

  createOrder(items: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, items);
  }

  listOrderItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/order-info`);
  }

}