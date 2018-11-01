import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesTiendaComponent } from './solicitudes-tienda.component';

describe('SolicitudesTiendaComponent', () => {
  let component: SolicitudesTiendaComponent;
  let fixture: ComponentFixture<SolicitudesTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
