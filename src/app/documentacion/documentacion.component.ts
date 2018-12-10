import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons';
import { SPServicio } from '../servicios/sp.servicio';
import { Actividad } from '../dominio/actividad';
import { Subject } from 'rxjs';

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
        this.chRef.detectChanges();
        const table: any = $('table');
        this.dataTable = table.DataTable({
          "language": {
            "info": "Mostrando _START_ de _END_ de _TOTAL_ actividades",
            "paginate": {
              "first": "Primero",
              "last":   "Último",
              "previous": "Anterior",
              "next": "Siguiente"
            },
            "sSearch": "Buscar",
            "sLengthMenu": "Mostrar actividades _MENU_",
            "emptyTable": "No hay actividades que mostrar",
            "infoEmpty":  "Mostrando 0 de 0 de _MAX_ actividades",
            "zeroRecords": "No hay actividades que mostrar",
            "processing": "Procesando",
            "infoFiltered": "(filtrado de _MAX_ actividades)",
            "loadingRecords": "Cargando...",
          }
        });
        this.dataTable.buttons().containers('#button-export-dtt');
      }, err => {
        console.log('Error obteniendo actividades: ' + err);
      }
    )
  }

}

