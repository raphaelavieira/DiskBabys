import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { orders } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { OrderService } from 'src/app/services/order.service';
import { ProductCrudService } from 'src/app/services/product-crud.service';
import { UserListCrudService } from 'src/app/services/user-list-crud.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  updateUserForm: FormGroup;
  showModal: boolean = false;
  users$:Observable<User[]>;
  requests:Observable<orders[]>;
  currentPage: string = 'listar-clientes';
  newProductForm: FormGroup;
  updateProductForm: FormGroup;
  products$: Observable<Product[]>;
  productToUpdate: Product;
  showDeleteModal: boolean = false;
  userToDeleteId: number;
  darkMode: boolean = false;


  constructor(
    private router: Router,
    private userListCrudService:UserListCrudService,
    private orderService: OrderService,
    private toastr: ToastrService,
    private productCrudService: ProductCrudService,
    private titleService: Title
    ) { }

  ngOnInit(): void {
    this.users$ = this.userListCrudService.fetchAll();
    this.newProductForm = this.createProductFormGroup();
    this.updateProductForm = this.createUpdateProductFormGroup();
    this.titleService.setTitle('Adminstrativo DiskBaby');
  }

  createFormGroup(user): FormGroup {
    return new FormGroup({
      id: new FormControl({ value: user.id, disabled: false }, [Validators.required]),
      email: new FormControl({ value: user.email, disabled: false }, [Validators.required, Validators.email]),
      password: new FormControl(user.password, [Validators.required]),
      role: new FormControl(user.role, [Validators.required]),
      picture: new FormControl(user.picture, [Validators.required]),
      phone: new FormControl(user.phone, [Validators.required]),
      address: new FormControl(user.address, [Validators.required]),
      name: new FormControl(user.name, [Validators.required])
    });
  }
  createProductFormGroup():FormGroup{
    return new FormGroup({
      product_name: new FormControl("",[Validators.required]),
      description: new FormControl("",[Validators.required]),
      price: new FormControl("",[Validators.required]),
      picture: new FormControl("",[Validators.required])

    });
  }

  createUpdateProductFormGroup():FormGroup{
    return new FormGroup({
      pid: new FormControl("",[Validators.required]),
      product_name: new FormControl("",[Validators.required]),
      description: new FormControl("",[Validators.required]),
      price: new FormControl("",[Validators.required]),
      picture: new FormControl("",[Validators.required])
    });
  }
  openDeleteModal(userId: number) {
    this.userToDeleteId = userId;
    this.showDeleteModal = true;
  }

  deleteConfirmed() {
    this.delete(this.userToDeleteId);

    this.showDeleteModal = false;
  }
  toggleDarkMode() {
    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }


  update(userPut: User): void {
    this.updateUserForm = this.createFormGroup(userPut);
    this.showModal = true;
  }
  updateBase(): void {
    console.log(this.updateUserForm.value);
    var user = {
      id: this.updateUserForm.controls['id'].value,
      email: this.updateUserForm.controls['email'].value,
      password: this.updateUserForm.controls['password'].value,
      role: this.updateUserForm.controls['role'].value,
      picture: this.updateUserForm.controls['picture'].value,
      name: this.updateUserForm.controls['name'].value,
      address: this.updateUserForm.controls['address'].value,
      phone: this.updateUserForm.controls['phone'].value,
      token: 'token_value'
    }
    this.userListCrudService.update(user).subscribe(
      response => {
        console.log(response.status);
        if (response && response.status === true) {
          this.toastr.success('Dados atualizados com sucesso!', 'Sucesso');
          window.location.reload();
          } else if (response && response.status === false) {
          this.toastr.error(response.message || 'Erro ao atualizar cadastro. Por favor, tente novamente mais tarde.', 'Erro');
          console.log("Erro ao atualizar cadastro: " + response.message);
        } else {
          this.toastr.error('Erro ao atualizar cadastro. Por favor, tente novamente mais tarde.', 'Erro');
        }
      },
      error => {
        console.error(error);
        if (error && error.error && error.error.message) {
          this.toastr.error(error.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao atualizar cadastro. Por favor, tente novamente mais tarde.', 'Erro');
        }
      }
    );
  }



  Logout(){
    localStorage.clear();
    this.router.navigate(['home']);
    this.toastr.success(' Logout  realizado com sucesso');
  }

  delete(id:number):void{
    this.userListCrudService.delete(id).subscribe();
    var loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    if(loggedInUser.id==id){
      localStorage.removeItem('currentUser');
      this.router.navigate([""]);
    }
    else{
      window.location.reload();
    }
  }

  changePage(page: string) {
    this.currentPage = page;

    if (page === 'listar-clientes') {
      this.currentPage = 'listar-clientes'
    } else if (page === 'listar-pedidos') {
      this.currentPage = 'listar-pedidos'
      this.getAllRequests();
    } else if (page === 'atualizar-produto') {
      this.currentPage = 'atualizar-produto'
      this.getAllProducts();
    } else if (page === 'adicionar-produto') {
      this.currentPage = 'adicionar-produto'
    }
  }


  getAllRequests(){
    this.orderService.fetchAll().subscribe(
      (requests: orders[]) => {
        this.requests = of(requests);
      },
      (error) => {
        this.toastr.error('Erro ao carregar os produtos.', 'Erro');
        console.log(error);
      }
    );
  }

  getAllProducts() {
    this.productCrudService.fetchAll().subscribe(
      (products: Product[]) => {
        this.products$ = of(products);
      },
      (error) => {
        this.toastr.error('Erro ao carregar os produtos.', 'Erro');
        console.log(error);
      }
    );
  }

  postProduct() {
    let inpOne = this.newProductForm.controls['product_name'].value.trim();
    let inpTwo = this.newProductForm.controls['description'].value.trim();
    let inpFour = this.newProductForm.controls['price'].value;
    let inpFile = this.newProductForm.controls['picture'].value;

    this.productCrudService.postProduct(this.newProductForm.value).subscribe(
      (response) => {
        if (response.status) {
          this.newProductForm.reset();
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
  }


  public onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.newProductForm.patchValue({
          picture: reader.result
        });
      };
    }
  }


  toggleUpdateProduct(product: Product){
      this.productToUpdate = product;
      this.updateProductForm.controls['pid'].setValue(this.productToUpdate.pid);
      this.updateProductForm.controls['product_name'].setValue(this.productToUpdate.nome_produto);
      this.updateProductForm.controls['description'].setValue(this.productToUpdate.descricao);
      this.updateProductForm.controls['price'].setValue(this.productToUpdate.preco);
      this.showModal = true;
  }
  public onProductFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.updateProductForm.patchValue({
          picture: reader.result
        });
        this.productToUpdate.foto = this.updateProductForm.controls['picture'].value;
      };
    }
  }

  editProduct()
  {
    this.productCrudService.updateProduct(this.updateProductForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.toastr.success(response.message, 'Sucesso');
          this.currentPage = 'atualizar-produto'
          location.reload();
        } else {
          this.toastr.error(response.message, 'Erro');
        }
      },
      (error) => {
        this.toastr.error('Erro interno no servidor', 'Erro');
        console.error(error);
      }
      );
  }



  deteleProductDialog(id:number)
  {
    this.productCrudService.deleteProduct(id).subscribe(
      (response) => {
        if (response.success) {
          this.toastr.success(response.message, 'Sucesso');
          this.currentPage = 'atualizar-produto'
          location.reload();
        } else {
          this.toastr.error(response.message, 'Erro');
        }
      },
      (error) => {
        this.toastr.error('Erro interno no servidor', 'Erro');
        console.error(error);
      }
      );

  }

}
