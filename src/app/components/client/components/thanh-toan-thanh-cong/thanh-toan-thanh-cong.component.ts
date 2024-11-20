import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thanh-toan-thanh-cong',
  templateUrl: './thanh-toan-thanh-cong.component.html',
  styleUrls: ['./thanh-toan-thanh-cong.component.scss'],
})
export class ThanhToanThanhCongComponent implements OnInit {
  constructor(
    private matDialogRef: MatDialogRef<ThanhToanThanhCongComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  ngOnInit(): void {}
  close() {
    this.matDialogRef.close();
  }
  goto() {
    this.matDialogRef.close();
    this.router.navigate(['/g4/shop/khach-hang'], {
      queryParams: {
        activeItem: 1,
        idhd: this.data.body.id,
      },
    });
  }
}
