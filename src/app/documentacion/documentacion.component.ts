import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { SPServicio } from '../servicios/sp.servicio';
import { Actividad } from '../dominio/actividad';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.css']
})
export class DocumentacionComponent implements OnInit {
  tituloPagina = "Documentación";
  actividades: Actividad[] = [];
  dataTable: any;

  constructor(private servicio: SPServicio, private chRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.obtenerActividadesGenerales();
  }

  obtenerActividadesGenerales() {
    this.servicio.obtenerActividadesGenerales().subscribe(
      (Response) => {
        this.actividades = Actividad.fromJsonList(Response);
        console.log(this.actividades);
        this.chRef.detectChanges();
        const table: any = $('table');
        this.dataTable = table.DataTable();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

}

