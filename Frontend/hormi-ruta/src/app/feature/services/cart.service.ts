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
  const body = items; 

  return this.http.post(`${this.apiUrl}/create-order?userId=${userId}`, body);
}

  listOrderItems(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list/${userId}`);
  }
}