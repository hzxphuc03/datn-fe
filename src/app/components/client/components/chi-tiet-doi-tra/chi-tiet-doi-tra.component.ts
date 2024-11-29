import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeServoceService } from '../../services/home-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-chi-tiet-doi-tra',
  templateUrl: './chi-tiet-doi-tra.component.html',
  styleUrls: ['./chi-tiet-doi-tra.component.scss'],
})
export class ChiTietDoiTraComponent implements OnInit {
  idPhieu: any = null;
  data: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: HomeServoceService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.idPhieu = params['idphieu'];

      if (!this.idPhieu) {
        const queryParams = {
          activeItem: 8,
        };
        this.router.navigate(['/g4/shop/khach-hang'], { queryParams });
      }
    });
    this.getAllDetailPhieu();
  }
  getAllDetailPhieu() {
    this.spinner.show();
    this.service.getPhieuDoiTraById(this.idPhieu).subscribe((res) => {
      this.spinner.hide();
      this.data = res;
      console.log(this.data);
    });
  }
  isVideo(url: string): boolean {
    // Kiểm tra nếu URL kết thúc bằng ".mp4" hoặc các định dạng video khác
    return url.endsWith('.mp4');
  }
}
