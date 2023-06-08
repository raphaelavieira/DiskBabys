import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
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

  constructor(private productCrudService: ProductCrudService, private router: Router,private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.singleItem$ = null;
    this.singleItemPic$ = null;
    this.getAllProducts();
  }

  getAllProducts() {
    this.productCrudService.fetchAll().subscribe(
      (products: Product[]) => {
        this.products$ = of(products); // Transforma o array em um Observable
      },
      (error) => {
        this.toastr.error('Erro ao carregar os produtos.', 'Erro');
        console.log(error);
      }
    );
  }


  async viewProduct(pid: number): Promise<void> {
    this.singleItem$ = this.productCrudService.getProductForCart(pid);

    try {
      await this.singleItem$.forEach(value => sessionStorage.setItem('currentItem', JSON.stringify([value][0])));
    }
    catch {
      console.log('Erro no produto');
      this.toastr.error('Erro no produto, tente novamente mais tarde.', 'Erro');
    }

    this.singleItemPic$ = this.productCrudService.getProduct(pid);
    try {
      await this.singleItemPic$.forEach(value => sessionStorage.setItem('currentItemPic', JSON.stringify([value][0])));
    }
    catch {
      console.log('Erro na imagem do produto');
      this.toastr.error('Erro na imagem do produto Por favor, tente novamente mais tarde.', 'Erro');
    }


    this.router.navigate(["produto"]);
  }
}
