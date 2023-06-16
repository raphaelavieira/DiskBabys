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



  fetchAll(): Observable<Pedidos[]> {
    return this.http.get<Pedidos[]>(this.url, { responseType: "json" });
  }


}
