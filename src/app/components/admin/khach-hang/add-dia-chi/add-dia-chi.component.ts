import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DiaChiServiceService } from 'src/app/shareds/dia-chi-service.service';

@Component({
  selector: 'app-add-dia-chi',
  templateUrl: './add-dia-chi.component.html',
  styleUrls: ['./add-dia-chi.component.scss']
})
export class AddDiaChiComponent implements OnInit {
  idTinhThanh : any;
  listTinhThanh : any[] = [];
  filterListTinhThanh : any[] = [];
  // 
  idQuanHuyen : any;
  listQuanHuyen : any[] = [];
  filterListQuanHuyen : any[] = [];
  // 
  idQuanXa : any;
  listQuanXa : any[] = [];
  filterListQuanXa : any[] = [];
  // 
  constructor(private serviceLocation : DiaChiServiceService,
    private matDialogRef: MatDialogRef<AddDiaChiComponent>,
    @Inject(MAT_DIALOG_DATA) public getData: any,
  ) { 
  }
  // add or update

  ngOnInit(): void {
    this.getAllTinhThanh();
    
  }
  filterTinhThanh(event : any){
    let filtered: any[] = [];
        let query = event.query;
        for (let i = 0; i < (this.listTinhThanh as any[]).length; i++) {
            let country = (this.listTinhThanh as any[])[i];
            if (country.ProvinceName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push({
                  key : country.ProvinceID,
                  name :country.ProvinceName
                });
            }
        }

        this.filterListTinhThanh = filtered;   
  }
  filterCountry(event : any){
  }
  async getAllTinhThanh(){
    const data = await this.serviceLocation.getAllTinhThanh().toPromise();
    if(data){
      this.listTinhThanh = data.data; 
    }
    
  }
}
