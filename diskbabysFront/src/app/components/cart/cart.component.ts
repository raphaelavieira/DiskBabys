import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { User } from 'src/app/models/user';
import { CartCrudService } from 'src/app/services/cart-crud.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems$: Observable<Cart[]>;
  itemCount$: Observable<any>;
  price$: Observable<any>;
  currUser$: User;
  profilePicture: string;
  finalize: boolean = false;
  totalOrder: number = 0
  deliveryForm: FormGroup;

  constructor(private cartCrudService: CartCrudService, private router: Router, private toastr: ToastrService,private titleService: Title,private http: HttpClient) {
    this.currUser$ = JSON.parse(localStorage.getItem('currentUser'));
    this.profilePicture = this.currUser$.picture;
  }

  ngOnInit(): void {
    this.cartItems$ = this.cartCrudService.fetchAll(this.currUser$.id)
    this.itemCount$ = this.cartCrudService.getCount(this.currUser$.id)
    this.price$ = this.cartCrudService.getPrice(this.currUser$.id)
    this.showCart();
    this.titleService.setTitle("Carrinho");
    this.deliveryForm = new FormGroup({
      cep: new FormControl('', Validators.required),
      rua: new FormControl('', Validators.required),
      bairro: new FormControl('', Validators.required),
      cidade: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      formaPagamento: new FormControl('', Validators.required)
    });

  }

  consult(cep: string): void {
    if (!cep) {
      return;
    }
    try {
      const urlViacep = `https://viacep.com.br/ws/${cep}/json/`;
      this.http.get(urlViacep).subscribe(
        (res: any) => {
          if (res.erro) {
            this.deliveryForm.patchValue({ cep: '' });
            return;
          }

          this.deliveryForm.patchValue({
            cep: cep,
            rua: res.logradouro,
            bairro: res.bairro,
            cidade: res.localidade,
            estado: res.uf
          });
        },
        (error) => {
          console.log(error);
          this.toastr.error('Erro ao consultar CEP', 'Erro');
        }
      );
    } catch (error) {
      console.log(error);
      this.toastr.error('Erro ao consultar CEP', 'Erro');
    }
  }


  delete(cid: number): void {
    this.cartCrudService.delete(cid).subscribe(
      (response: any) => {
        if (response && response.status) {
          this.toastr.success(response.message, 'Sucesso');
        } else {
          this.toastr.error(response.message, 'Erro');
        }
      },
      (error) => {
        this.toastr.error('Erro interno no servidor', 'Erro');
        console.error(error);
      }
    );
    window.location.reload();
  }

  checkout(): void {
    this.finalize = true;
  }

  goCart(): void {
    this.finalize = false;
  }

  emptyCart(): void {
    this.cartCrudService.deleteAll(this.currUser$.id).subscribe();
    this.toastr.success('Carrinho limpo com sucesso', 'Sucesso');
    window.location.reload();
  }

  emptyCartCheck: boolean = false;
  defEmptyCart: boolean = false;

  async showCart() {
    try {
      await this.itemCount$.forEach(value => localStorage.setItem('records', JSON.stringify([value][0])));
    }
    catch {
      console.log('Error');
    }

    var records = JSON.parse(localStorage.getItem('records'));
    if (records == 0) {
      this.emptyCartCheck = false;
      this.defEmptyCart = true;
    }
    else {
      this.emptyCartCheck = true;
      this.defEmptyCart = false;
      this.total();
    }
  }

  async total(): Promise<void> {

    try {
      await this.price$.forEach(value => localStorage.setItem('price', JSON.stringify([value][0].toFixed(2))));
    }
    catch {
      console.log('error');
    }

    this.totalOrder = JSON.parse(localStorage.getItem('price'));
  }

  checkoutOrder(): void {
    if (this.deliveryForm.invalid) {
      this.toastr.error('Por favor, preencha todos os campos', 'Erro');
      return;
    }

    const order = {
      id: this.currUser$.id,
      preco_total: this.totalOrder,
      forma_pagamento: this.deliveryForm.value.formaPagamento,
      cep: this.deliveryForm.value.cep,
      rua: this.deliveryForm.value.rua,
      bairro: this.deliveryForm.value.bairro,
      cidade: this.deliveryForm.value.cidade,
      estado: this.deliveryForm.value.estado,
      numero: this.deliveryForm.value.numero
    };

    this.cartCrudService.postOrder(order).subscribe(
      () => {
        this.toastr.success('Pedido enviado com sucesso', 'Sucesso');
        // Redirecionar para a página de sucesso do pedido ou outra página, se necessário
        this.cartCrudService.deleteAll(this.currUser$.id).subscribe();
         this.router.navigate(['/success']);
      },
      (error) => {
        if (error && error.error && error.error.message) {
          this.toastr.error(error.error, 'Erro');
        } else {
          console.log(error);
          this.toastr.error('Erro ao enviar o pedido', 'Erro');
        }
      }
    );
  }




}
