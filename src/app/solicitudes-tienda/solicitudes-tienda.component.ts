import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap';
import { SPServicio } from '../servicios/sp.servicio';
import { TiendaXJefe } from '../dominio/TiendaXJefe';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons';
import { Usuario } from "../dominio/usuario";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-solicitudes-tienda',
  templateUrl: './solicitudes-tienda.component.html',
  styleUrls: ['./solicitudes-tienda.component.css']
})
export class SolicitudesTiendaComponent implements OnInit {
  tituloPagina = "Revisar novedades";
  colorTheme = 'theme-blue';
  NovedadForm: FormGroup;
  submitted: boolean;
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
  usuarioActual: Usuario;
  UsuarioActualId: any;

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private chRef: ChangeDetectorRef, private _localeService: BsLocaleService, private router: Router) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.ValidarPerfilacion();
    this.loading = false;
    this.cantidadRegistros = true;
    this.mostrarTabla = true;
    this.submitted = false;
    this._localeService.use('engb');
  }

  ngOnInit() {
    this.loading = true;
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    this.NovedadForm = this.formBuilder.group({      
      txtFecha: [ "", Validators.required],
      txtTipoSolicitud: [""]     
    });    
    this.obtenerUsuariosPorJefeInmediato();
  }

  private ValidarPerfilacion() {
    if (this.usuarioActual != null) {
      if (this.usuarioActual.rol != null) {
        switch (this.usuarioActual.rol.toLowerCase()) {
          case "administrador de tienda":
            this.router.navigate(['/acceso-denegado']);
            break;
          case "jefe de zonas":
            console.log("perfilación correcta");
            break;
          case "administrador sistemática comercial":
            this.router.navigate(['/acceso-denegado']);
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

  private obtenerUsuariosPorJefeInmediato() {
    this.servicio.ObtenerUsuariosXJefe(this.usuarioActual.id).subscribe((ResponseTienda) => {
      this.ObjTiendas = TiendaXJefe.fromJsonList(ResponseTienda);
      this.ObtenerTipoSolicitud();
    });
  }

  ObtenerTipoSolicitud() {
    this.servicio.ObtenerTiposolicitud().subscribe(
      (respuestaTipoSolicitud) => {
        this.ObjTipoSolicitud = respuestaTipoSolicitud;
        this.ObtenerUsuarioActual();
        this.loading = false;
      }
    );
  }
  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (respuesta)=>{        
        this.UsuarioActualId = respuesta.Id;
      }
    )
  }

  get f() {
    return this.NovedadForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.NovedadForm.invalid) {
      return;
    }
    this.loading = true;
    let siwtch = 0;
    let StringConsulta = "";
    this.ObjRespuestaConsulta = [];

    if ($.fn.dataTable.isDataTable('table')) {
      this.dataTable.destroy();
    }
    
    let stringConsulta;
    let TipoSolicitud=this.NovedadForm.controls['txtTipoSolicitud'].value;
    this.FechaSolicitud = this.NovedadForm.controls['txtFecha'].value;
    let fechaInicioString = this.formatDate(this.FechaSolicitud[0]);
    let fecha2String = this.formatDate(this.FechaSolicitud[1]);
    if (TipoSolicitud === "") {
      stringConsulta = "Fecha ge datetime'" + fechaInicioString + "T00:00:00.00Z" + "' and Fecha le datetime'" + fecha2String + "T23:59:59.59Z'";
    }
    else {
      stringConsulta = "TipoSolicitudId eq '" + TipoSolicitud + "' and Fecha ge datetime'" + fechaInicioString + "T00:00:00.00Z" + "' and Fecha le datetime'" + fecha2String + "T23:59:59.59Z'";
    }
    
    this.servicio.ObtenerSolicitudes(stringConsulta).subscribe(
      (respuestaConsulta) => {
        this.ObjRespuestaConsulta = respuestaConsulta;
        if (respuestaConsulta.length === 0) {
          this.cantidadRegistros = false;
          this.mostrarTabla = true;
        }
        else {
          this.cantidadRegistros = true;
          this.mostrarTabla = false;
          this.AgregarDataTable();
        }
        this.loading = false;
      }
    );
  }

  // buscarSolicitudes() {
  //   let siwtch = 0;
  //   let StringConsulta = "";
  //   this.ObjRespuestaConsulta = [];
  //   if ($.fn.dataTable.isDataTable('table')) {
  //     this.dataTable.destroy();
  //   }
  //   // StringConsulta = "Tienda eq '"+this.UsuarioActualId+"' ";
  //   // if (this.Tienda !== "" && this.Tienda !== undefined) {
  //   //   StringConsulta = "Tienda eq '" + this.Tienda + "'";
  //   //   siwtch = 1;
  //   // }
  //   if (this.TipoSolicitud !== "" && this.TipoSolicitud !== undefined) {      
  //       StringConsulta = "TipoSolicitud eq '" + this.TipoSolicitud + "'";
  //       siwtch = 1;      
  //   }
  //   if (this.FechaSolicitud !== "" && this.FechaSolicitud !== undefined) {
  //     let fechaInicioString = this.formatDate(this.FechaSolicitud[0]);
  //     let fecha2String = this.formatDate(this.FechaSolicitud[1]);
  //     if (siwtch === 1) {
  //       StringConsulta = StringConsulta + " and Fecha ge datetime'" + fechaInicioString + "T00:00:00.00Z" + "' and Fecha le datetime'" + fecha2String + "T23:59:59.59Z'";
  //     } else {
  //       StringConsulta = "Tienda eq '"+this.UsuarioActualId+"' and Fecha ge datetime'" + fechaInicioString + "T00:00:00.00Z" + "' and Fecha le datetime'" + fecha2String + "T23:59:59.59Z'";
  //       siwtch = 1;
  //     }
  //   }
  //   // if(siwtch == 0){
  //   //   StringConsulta = "Tienda eq '"+this.UsuarioActualId+"'";
  //   // }

  //   this.servicio.ObtenerSolicitudes(StringConsulta).subscribe(
  //     (respuestaConsulta) => {
  //       this.ObjRespuestaConsulta = respuestaConsulta;
  //       if (respuestaConsulta.length === 0) {
  //         this.cantidadRegistros = false;
  //         this.mostrarTabla = true;
  //       }
  //       else {
  //         this.cantidadRegistros = true;
  //         this.mostrarTabla = false;
  //         this.AgregarDataTable();
  //       }
  //       this.loading = false;
  //     }
  //   );
  // }

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
