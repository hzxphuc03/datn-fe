import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { FormThanhToanComponent } from '../form-thanh-toan/form-thanh-toan.component';
import { HoaDonService } from '../../service/hoa-don.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-thanh-cong-or-that-bai-thanh-toan',
  templateUrl: './thanh-cong-or-that-bai-thanh-toan.component.html',
  styleUrls: ['./thanh-cong-or-that-bai-thanh-toan.component.scss'],
})
export class ThanhCongOrThatBaiThanhToanComponent implements OnInit {
  data: any;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private matDialogRef: MatDialogRef<ThanhCongOrThatBaiThanhToanComponent>,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private errorService: ErrorTsService,
    private service: HoaDonService
  ) {}

  ngOnInit(): void {
    this.getHoaDonById();
  }
  async getHoaDonById() {
    if (this.getData.vnpOrderInfo) {
      const api = await this.service
        .getHDbyId(this.getData.vnpOrderInfo)
        .toPromise();
      if (api) {
        if (api?.errorCode) {
          this.errorService.displayError(api.messageError, 'error');
        } else {
          this.data = api.body;
        }
      }
    }
  }
  close() {
    this.matDialogRef.close('check');
  }
  generatePDF() {
    const data = document.getElementById('contentToExport'); // ID của phần tử HTML bạn muốn xuất

    html2canvas(data!).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190; // Chiều rộng hình ảnh trong PDF
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Thêm hình ảnh vào PDF
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Nếu chiều cao hình ảnh lớn hơn chiều cao trang PDF, thêm trang mới
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Tải file PDF về
      pdf.save(`bill-id-${this.data.id}.pdf`);
    });
  }
}
