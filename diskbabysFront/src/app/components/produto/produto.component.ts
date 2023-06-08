import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
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

  constructor(private cartCrudService: CartCrudService, private router: Router,private titleService: Title) { }

  ngOnInit(): void {
    this.currItem$ = JSON.parse(sessionStorage.getItem('currentItem'));
    this.currItemPic$ = JSON.parse(sessionStorage.getItem('currentItemPic'));
    this.loggedInUser$ = JSON.parse(sessionStorage.getItem('currentUser'));
    this.profilePicture = this.loggedInUser$.picture;
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
  teste(){
    console.log(this.facilitatorForm.value);
  }
  post(): void {
    console.log(this.facilitatorForm.value);
    this.cartCrudService.post(this.facilitatorForm.value).subscribe();
    sessionStorage.removeItem('currentItem');
    sessionStorage.removeItem('currentItemPic');
    this.router.navigate(["shop"]);
  }



  cancel(): void {
    sessionStorage.removeItem('currentItem');
    sessionStorage.removeItem('currentItemPic');
    this.router.navigate(["shop"]);
  }


  addToCart(): void {
    console.log(this.currItem$);
  }

}
