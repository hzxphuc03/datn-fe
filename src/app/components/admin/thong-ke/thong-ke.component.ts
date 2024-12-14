import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ThongKeServiceService } from '../service/thong-ke-service.service';
import {Chart} from 'chart.js/auto';

@Component({
  selector: 'app-thong-ke',
  templateUrl: './thong-ke.component.html',
  styleUrls: ['./thong-ke.component.scss']
})
export class ThongKeComponent implements OnInit {

  listData : any = [];
  doanhSoThangNay : any = {};
  doanhSoHomNay : any = {};
  listTop5 : any = [];
  labels: string[] = []; // Khởi tạo là mảng
  data: number[] = [];
  doanhSoTheoNgay: any ={};
  labelDoanhSoTheoNgay: string[] = [];
  dataDoanhSoTheoNgay: number[] = [];

  constructor(
    private service: ThongKeServiceService,
  ) { }

  ngOnInit(): void {
    this.getThongKe();
  }

  async getThongKe(): Promise<void> {
    const data = await this.service.getDoanhSoThangNay().toPromise();
    if (data) {
      this.listData = data;
      this.doanhSoThangNay = this.listData[0];
      this.doanhSoHomNay = this.listData[1];

      await this.getTop5SanPham();
      await this.getDoanhSoTheoNgay();
      this.createChart(); 
      this.createChart1();// Gọi hàm tạo biểu đồ sau khi có dữ liệu
    }
  }

  async getDoanhSoTheoNgay(): Promise<void> {
    const data = await this.service.getDoanhSoTheoNgay().toPromise();
    if (data) {
      this.doanhSoTheoNgay = data;
      this.labelDoanhSoTheoNgay = this.doanhSoTheoNgay.map((item: { ngayThang: number; doanhSo: number }) => item.ngayThang);
      this.dataDoanhSoTheoNgay = this.doanhSoTheoNgay.map((item: { ngayThang: number; doanhSo: number }) => item.doanhSo);

      
    }
  }

  async getTop5SanPham(): Promise<void> {
    const data = await this.service.getTop5SanPham().toPromise();
    if (data) {
      this.listTop5 = data;
      this.labels = []; // Reset labels
      this.data = []; // Reset data

      this.listTop5.forEach((item: any) => {
        this.labels.push(String(item.tenSanPham)); // Thêm vào mảng
        this.data.push(Number(item.soLuong)); // Thêm vào mảng
      });
      
      console.log(this.labels);
      console.log(this.data);
    }
  }

  async excel(): Promise<void> {
    const data = await this.service.getExcel().toPromise();
    if (data) {
      
    }
  }

  createChart1(): void {
    new Chart('myChart1', {
      type: 'bar',
      data: {
        labels: this.labelDoanhSoTheoNgay,
        datasets: [{
          label: 'Doanh số',
          data: this.dataDoanhSoTheoNgay,
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false, // Không duy trì tỷ lệ khung hình
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createChart(): void {
    new Chart('myChart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Số lượng sản phẩm đã bán',
          data: this.data,
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false, // Không duy trì tỷ lệ khung hình
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
