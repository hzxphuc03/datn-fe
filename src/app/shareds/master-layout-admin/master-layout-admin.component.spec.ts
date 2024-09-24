import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterLayoutAdminComponent } from './master-layout-admin.component';

describe('MasterLayoutAdminComponent', () => {
  let component: MasterLayoutAdminComponent;
  let fixture: ComponentFixture<MasterLayoutAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterLayoutAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterLayoutAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
