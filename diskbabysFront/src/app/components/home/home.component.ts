import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductCrudService } from 'src/app/services/product-crud.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products$: Observable<Product[]>
  singleItem$: Observable<Product>;
  singleItemPic$: Observable<Product>;
  profilePicture: string;

  constructor(private productCrudService: ProductCrudService, private router: Router) {

  }

  ngOnInit(): void {
    this.singleItem$ = null;
    this.singleItemPic$ = null;
    this.products$ = this.productCrudService.fetchAll();
  }

}
