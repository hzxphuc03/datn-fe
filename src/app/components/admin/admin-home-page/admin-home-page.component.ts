import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-home-page',
  templateUrl: './admin-home-page.component.html',
  styleUrls: ['./admin-home-page.component.scss'],
})
export class AdminHomePageComponent implements OnInit {
  cities: any[] = [];
  selectedCity: any;
  letters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  interval: any = null;
  originalText: string = 'WELLCOME BACK DUY'; // Thay thế với văn bản gốc của bạn
  index: number = 0;
  displayedText: string = '';

  constructor(private spinner: NgxSpinnerService) {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
  }

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
    this.displayedText = this.originalText; // Hiển thị văn bản gốc
    this.startCodeCrackEffect();
  }
  ngOnDestroy() {
    clearInterval(this.interval); // Dọn dẹp khi component bị hủy
  }
  startCodeCrackEffect() {
    this.interval = setInterval(() => {
      this.codeCrackEffect();
    }, 50);
  }

  codeCrackEffect() {
    const randomText = this.originalText
      .split('')
      .map((char, i) => {
        if (i < this.index) {
          return this.originalText[i];
        }
        return this.letters[Math.floor(Math.random() * 26)];
      })
      .join('');

    this.displayedText = randomText;

    if (this.index >= this.originalText.length) {
      clearInterval(this.interval);
    }

    this.index += 1 / 3; // Chỉnh tốc độ của hiệu ứng
  }
}
