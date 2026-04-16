import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://localhost:44384/api/Cart'; 

  constructor(private http: HttpClient) { }
   
  createOrder(items: any[], userId: string): Observable<any> {
    // Mandamos el array de items directamente y el ID por la URL
    return this.http.post(`${this.apiUrl}/create-order?userId=${userId}`, items);
  }

  listOrderItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/order-info`);
  }
}