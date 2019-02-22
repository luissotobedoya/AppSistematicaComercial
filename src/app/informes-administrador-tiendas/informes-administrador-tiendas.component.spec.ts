import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesAdministradorTiendasComponent } from './informes-administrador-tiendas.component';

describe('InformesAdministradorTiendasComponent', () => {
  let component: InformesAdministradorTiendasComponent;
  let fixture: ComponentFixture<InformesAdministradorTiendasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformesAdministradorTiendasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformesAdministradorTiendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
