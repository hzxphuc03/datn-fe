import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-thong-tin-nhan-hang',
  templateUrl: './thong-tin-nhan-hang.component.html',
  styleUrls: ['./thong-tin-nhan-hang.component.scss'],
})
export class ThongTinNhanHangComponent implements OnInit {
  constructor(
    private matDialogRef: MatDialogRef<ThongTinNhanHangComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }
  ngOnInit(): void {}
}
