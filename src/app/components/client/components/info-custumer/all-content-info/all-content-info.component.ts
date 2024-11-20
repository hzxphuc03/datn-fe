import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-content-info',
  templateUrl: './all-content-info.component.html',
  styleUrls: ['./all-content-info.component.scss'],
})
export class AllContentInfoComponent implements OnInit {
  options = [
    'Tài khoản và bảo mật',
    'Đơn hàng',
    'Phiếu giảm giá',
    'Địa chỉ',
    'Cài đặt chung',
    'Trung tâm hỗ trợ',
    'Đánh giá sản phẩm',
  ];
  @ViewChild('targetElement') targetElement!: ElementRef;
  selectedIndex: number | null = 0;
  constructor(private router: Router, private route: ActivatedRoute) {
    // Lấy tham số từ URL khi trang được tải
    this.route.queryParams.subscribe((params) => {
      const activeItem = params['activeItem'];
      if (activeItem) {
        this.selectedIndex = parseInt(activeItem, 10);
      }
    });
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên trên cùng với hiệu ứng mượt
  }

  ngOnInit(): void {
    this.scrollToTop();
  }

  selectOption(index: number) {
    this.selectedIndex = index;
    // Cập nhật URL với tham số activeItem
    this.router.navigate([], {
      queryParams: { activeItem: index },
      queryParamsHandling: 'merge', // Giữ lại các tham số khác nếu có
    });
  }
}
