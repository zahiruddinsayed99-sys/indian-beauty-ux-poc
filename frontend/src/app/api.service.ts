import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products`);
  }

  getCheckoutDefaults(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/checkout/defaults`);
  }

  getWelcomeDiscount(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/discounts/welcome`);
  }

  customizeProduct(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products/customize`, payload);
  }

  checkout(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cart/checkout`, payload);
  }

  verifyPayment(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/payment/verify-sandbox`, payload);
  }

  getAdminOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/orders`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/admin/orders/${orderId}`, { status });
  }
}
