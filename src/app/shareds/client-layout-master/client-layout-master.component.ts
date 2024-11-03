import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { AutoServiceService } from '../auto-service.service';
import { ErrorTsService } from '../message/error.service';

@Component({
  selector: 'app-client-layout-master',
  templateUrl: './client-layout-master.component.html',
  styleUrls: ['./client-layout-master.component.scss']
})
export class ClientLayoutMasterComponent implements OnInit {
  isLoginKhachHang : boolean = true;
  
  constructor( 
    private tokenService: TokenService,
    private router: Router,
    private errorService: ErrorTsService,
    private autoVoucher: AutoServiceService
  ) { }

  ngOnInit(): void {
    this.checkToken();
  }
  checkToken() {
    const isExpired = this.tokenService.isTokenExpired();
        const { decoded } = this.tokenService.getToken();
        if (decoded) {
          if (isExpired) {
            this.errorService.displayError(
              'hết thời gian đăng nhập, vui lòng đăng nhập lại',
              'normal'
            );
            this.tokenService.removeToken();
            this.isLoginKhachHang = false;
          }
        } else {
          this.isLoginKhachHang = false;
        }
  }

}
