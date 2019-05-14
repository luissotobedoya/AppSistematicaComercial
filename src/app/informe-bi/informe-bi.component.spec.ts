import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeBIComponent } from './informe-bi.component';

describe('InformeBIComponent', () => {
  let component: InformeBIComponent;
  let fixture: ComponentFixture<InformeBIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformeBIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeBIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
