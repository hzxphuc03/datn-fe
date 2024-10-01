import { Component, Input, OnInit } from '@angular/core';
import { SanPhamFull, SanPham, ChiTietSanPham } from '../../service/interface';

@Component({
  selector: 'app-add-or-edit-ctsp',
  templateUrl: './add-or-edit-ctsp.component.html',
  styleUrls: ['./add-or-edit-ctsp.component.scss'],
})
export class AddOrEditCtspComponent implements OnInit {
  @Input() data: any;
  isAdd: boolean = true;
  constructor() {}

  ngOnInit(): void {}
}
