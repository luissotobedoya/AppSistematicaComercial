import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesExtrasComponent } from './actividades-extras.component';

describe('ActividadesExtrasComponent', () => {
  let component: ActividadesExtrasComponent;
  let fixture: ComponentFixture<ActividadesExtrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadesExtrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadesExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
