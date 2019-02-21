import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap';
import { SPServicio } from '../servicios/sp.servicio';
import { TiendaXJefe } from '../dominio/TiendaXJefe';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons';

@Component({
  selector: 'app-solicitudes-tienda',
  templateUrl: './solicitudes-tienda.component.html',
  styleUrls: ['./solicitudes-tienda.component.css']
})
export class SolicitudesTiendaComponent implements OnInit {
  tituloPagina = "Revisar novedades";
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  ObjTiendas: any[];
  ObjTipoSolicitud: any;
  loading: boolean;
  Tienda: any;
  FechaSolicitud: string;
  TipoSolicitud: string;
  ObjRespuestaConsulta: any[];
  cantidadRegistros: boolean;
  dataTable: any;
  mostrarTabla: boolean;
  
  constructor(private servicio:SPServicio, private chRef: ChangeDetectorRef,private _localeService: BsLocaleService) {
    this.loading=false;
    this.cantidadRegistros=true;
    this.mostrarTabla=true;
    this._localeService.use('engb');
   }

  ngOnInit() {
    this.loading = true;
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        let Usuario = Response.Id;
        this.servicio.ObtenerUsuariosXJefe(Usuario).subscribe(
          (ResponseTienda) => {
            this.ObjTiendas = TiendaXJefe.fromJsonList(ResponseTienda);   
            this.ObtenerTipoSolicitud();         
          }
        );
      }
    );
  }

  ObtenerTipoSolicitud() {
    this.servicio.ObtenerTiposolicitud().subscribe(
      (respuestaTipoSolicitud) => {
          this.ObjTipoSolicitud = respuestaTipoSolicitud;   
          this.loading = false;       
      }
    );
  }

  buscarSolicitudes(){
    let siwtch = 0;
    let StringConsulta = "";
    this.ObjRespuestaConsulta = [];

    if ( $.fn.dataTable.isDataTable( 'table' ) ) {
      this.dataTable.destroy();
    } 
    
    if (this.Tienda !== "" && this.Tienda  !== undefined) {
        StringConsulta = "Tienda eq '" + this.Tienda + "'";
        siwtch = 1;
    }
    if (this.TipoSolicitud !== "" && this.TipoSolicitud !== undefined) {
      if (siwtch === 1) {         
        StringConsulta = StringConsulta + " and TipoSolicitud eq '"+this.TipoSolicitud+"'";
      } else {
          StringConsulta = "TipoSolicitud eq '"+this.TipoSolicitud+"'";
          siwtch = 1;
      }
    }
    if (this.FechaSolicitud !== "" && this.FechaSolicitud !== undefined) {
      let fechaInicioString = this.formatDate(this.FechaSolicitud[0]);
      let fecha2String = this.formatDate(this.FechaSolicitud[1]);
      if (siwtch === 1) {         
        StringConsulta = StringConsulta + " and Fecha ge datetime'" + fechaInicioString + "T08:00:00.000Z" + "' and Fecha le datetime'" + fecha2String + "T08:00:00.000Z'";
      } else {
          StringConsulta = "Fecha ge datetime'" + fechaInicioString + "T08:00:00.000Z" + "' and Fecha le datetime'" + fecha2String + "T08:00:00.000Z'";
          siwtch = 1;
      }
    }

    this.servicio.ObtenerSolicitudes(StringConsulta).subscribe(
      (respuestaConsulta) => {
          this.ObjRespuestaConsulta = respuestaConsulta;  
          if (respuestaConsulta.length===0) {
             this.cantidadRegistros=false;
             this.mostrarTabla = true;
          }
          else {
            this.cantidadRegistros=true;
            this.mostrarTabla = false;
            this.AgregarDataTable();
          } 
          this.loading = false;       
      }
    );
  }

  private AgregarDataTable() {
    this.chRef.detectChanges();
    const table: any = $('table');
    this.dataTable = table.DataTable({
      "language": {
        "info": "Mostrando _START_ de _END_ de _TOTAL_ actividades",
        "paginate": {
          "first": "Primero",
          "last": "Último",
          "previous": "Anterior",
          "next": "Siguiente"
        },
        "sSearch": "Buscar",
        "sLengthMenu": "Mostrar actividades _MENU_",
        "emptyTable": "No hay actividades que mostrar",
        "infoEmpty": "Mostrando 0 de 0 de _MAX_ actividades",
        "zeroRecords": "No hay actividades que mostrar",
        "processing": "Procesando",
        "infoFiltered": "(filtrado de _MAX_ actividades)",
        "loadingRecords": "Cargando...",
      }
    });
  }

  formatDate(fecha): string {
    let d = new Date(fecha),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }
    return [year, month, day].join("-");
  }
}
