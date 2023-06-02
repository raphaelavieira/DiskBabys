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

  async viewProduct(pid: number): Promise<void> {
    this.singleItem$ = this.productCrudService.getProductForCart(pid);
    console.log(this.singleItem$);

    this.singleItem$.forEach(value => console.log([value][0]));
    try {
      await this.singleItem$.forEach(value => sessionStorage.setItem('currentItem', JSON.stringify([value][0])));
    }
    catch {
      console.log('error retrieving from db');
    }

    this.singleItemPic$ = this.productCrudService.getProduct(pid);
    this.singleItemPic$.forEach(value => console.log([value][0]));
    try {
      await this.singleItemPic$.forEach(value => sessionStorage.setItem('currentItemPic', JSON.stringify([value][0])));
    }
    catch {
      console.log('error retrieving from db');
    }


    this.router.navigate(["produto"]);
  }
}
