import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons';
import { SPServicio } from '../servicios/sp.servicio';
import { Actividad } from '../dominio/actividad';
import { Router } from '@angular/router';
import { Usuario } from '../dominio/usuario';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.css']
})
export class DocumentacionComponent implements OnInit {
  tituloPagina = "Documentación";
  actividades: Actividad[] = [];
  dataTable: any;
  usuarioActual: Usuario;

  constructor(private servicio: SPServicio, private chRef: ChangeDetectorRef, private router: Router) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.ValidarPerfilacion();
  }

  ngOnInit() {
    this.obtenerActividadesGenerales();
  }

  private ValidarPerfilacion() {
    if (this.usuarioActual != null) {
      if (this.usuarioActual.rol != null) {
        switch (this.usuarioActual.rol.toLowerCase()) {
          case "administrador de tienda":
            console.log("perfilación correcta");
            break;
          case "jefe de zonas":
            console.log("perfilación correcta");
            break;
          case "administrador sistemática comercial":
            console.log("perfilación correcta");
            break;
          default:
            this.router.navigate(['/acceso-denegado']);
            break;
        }
      } else {
        this.router.navigate(['/acceso-denegado']);
      }
    }
    else {
      this.router.navigate(['/acceso-denegado']);
    }
  }

  obtenerActividadesGenerales() {
    if ( $.fn.dataTable.isDataTable( 'table' ) ) {
      this.dataTable.destroy();
    } 
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
      }, err => {
        console.log('Error obteniendo actividades: ' + err);
      }
    );
  }

}

