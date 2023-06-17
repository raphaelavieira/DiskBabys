import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  private url = "http://localhost:3000/order/requests";

  constructor(private http: HttpClient) { }



  fetchAll(): Observable<orders[]> {
    return this.http.get<orders[]>(this.url, { responseType: "json" });
  }


  findOrder(pid: Number): Observable<orders[]> {
    const orderId = `http://localhost:3000/order/requests/${pid}`;
    return this.http.get<orders[]>(orderId, { responseType: "json" });
  }


}
