import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { CartCrudService } from 'src/app/services/cart-crud.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {
  currItem$: Product;
  currItemPic$: Product;
  loggedInUser$: User;
  facilitatorForm: FormGroup;
  profilePicture: string;
  imgSrc: string;

  constructor(private cartCrudService: CartCrudService, private router: Router,private titleService: Title,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.currItem$ = JSON.parse(localStorage.getItem('currentItem'));
    this.currItemPic$ = JSON.parse(localStorage.getItem('currentItemPic'));
    if(localStorage.getItem('currentUser')){
      this.loggedInUser$ = JSON.parse(localStorage.getItem('currentUser'));
      this.profilePicture = this.loggedInUser$.picture;
    }
    this.facilitatorForm = this.createFormGroup();
    this.titleService.setTitle(this.currItem$.descricao);
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(this.loggedInUser$.id, [Validators.required]),
      pid: new FormControl(this.currItem$.pid, [Validators.required]),
      product_name: new FormControl(this.currItem$.nome_produto, [Validators.required]),
      picture: new FormControl(this.currItem$.foto),
      price: new FormControl(this.currItem$.preco)
    });
  }

  post(): void {
    if (this.loggedInUser$) {
      this.cartCrudService.post(this.facilitatorForm.value).subscribe(
        () => {
          localStorage.removeItem('currentItem');
          localStorage.removeItem('currentItemPic');
          this.router.navigate(['cart']);
        },
        () => {
          this.toastr.error('Erro ao adicionar produto ao carrinho.', 'Erro');
        }
      );
    } else {
      this.toastr.warning('Para adicionar um produto ao carrinho, é necessário estar logado.', 'Atenção');
      this.router.navigate(['login']);
    }
  }




  cancel(): void {
    localStorage.removeItem('currentItem');
    localStorage.removeItem('currentItemPic');
    this.router.navigate(["shop"]);
  }



}
