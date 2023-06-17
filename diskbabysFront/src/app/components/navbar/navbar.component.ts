import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: string;


  constructor(private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('currentUser');
  }

  Logout(){
    this.currentUser = null;
    localStorage.clear();
    this.router.navigate(['home']);
    this.toastr.success(' Logout  realizado com sucesso');
  }
}
