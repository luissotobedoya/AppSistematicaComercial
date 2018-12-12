import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { SPServicio } from "../servicios/sp.servicio";
import { JefeZona } from "../dominio/Informe/JefeZona";
import { Clasificacion } from "../dominio/clasificacion";
import { ProcesoExtra } from "../dominio/procesosExtra";
import { RespuestaActividad } from "../dominio/Informe/RespuestaActividad";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Responsable } from "../dominio/Informe/Responsable";
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons';

@Component({
  selector: "app-informes",
  templateUrl: "./informes.component.html",
  styleUrls: ["./informes.component.css"]
})

export class InformesComponent implements OnInit {
  tituloPagina = "Informes";
  ObjZona: JefeZona[] = [];
  ObjClasificacion: Clasificacion[] = [];
  objProceso: ProcesoExtra[] = [];
  ObjResponsable: Responsable[] = [];
  DisalbeTienda: boolean;
  NombreCampo: string;
  txtFecha: [] = [];
  slctResponsableModel: string;
  slctTiendaZonaModel: string;
  slctClasificacion: string;
  slctProceso: string;
  stringConsulta: string;
  objRespuestaActividad: RespuestaActividad[] = [];
  objActividad = [];
  informeForm: FormGroup;
  submitted = false;
  maxPrioridad: number;
  dynamicPrioridadAlta: number;
  dynamicPrioridadMedia: number;
  dynamicPrioridadBaja: number;
  type: string;
  loading: boolean;
  cantidadRegistros: boolean;
  actividadesRealizadasAlta: number;
  actividadesRealizadasMedia: number;
  actividadesRealizadasBaja: number;
  contadorConsultas: number;
  contadorEntradas: number;
  contentArray: any;
  returnedArray: any;
  minDate: Date;
  maxDate: Date;
  dataTable: any;

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private chRef: ChangeDetectorRef) {
    this.NombreCampo = "";
    this.DisalbeTienda = true;
    this.txtFecha = [];
    this.slctResponsableModel = "";
    this.slctTiendaZonaModel = "";
    this.slctClasificacion = "";
    this.slctProceso = "";
    this.stringConsulta = "";
    this.maxPrioridad = 0;
    this.loading = false;
    this.cantidadRegistros = true;
    this.actividadesRealizadasAlta = 0;
    this.actividadesRealizadasMedia = 0;
    this.actividadesRealizadasBaja = 0;
    this.dynamicPrioridadAlta = 0;
    this.dynamicPrioridadMedia = 0;
    this.dynamicPrioridadBaja = 0;
    this.minDate = new Date("2018/11/01");
    this.maxDate = new Date();
  }

  ngOnInit() {
    this.loading = true;
    this.informeForm = this.formBuilder.group({
      txtFecha: ["", Validators.required],
      slcResponsable: ["", Validators.required],
      slcTienda: ["", Validators.required]
    });

    this.servicio.obtenerMaestroResponsable().subscribe(responsable => {
      this.ObjResponsable = Responsable.fromJsonList(responsable);
      this.loading = false;
    });
  }

  get f() {
    return this.informeForm.controls;
  }

  SeleccionarResponsable(IdResponsable) {

    if (IdResponsable === "2") {
      this.DisalbeTienda = false;
      this.NombreCampo = "Zona";
    } else if (IdResponsable === "1") {
      this.NombreCampo = "Tienda";
      this.DisalbeTienda = false;
    } else if (IdResponsable === "") {
      this.NombreCampo = "";
      this.DisalbeTienda = true;
    }
    this.servicio
      .obtenerJefeResponsable(IdResponsable)
      .subscribe(UsuarioLoguin => {
        this.ObjZona = JefeZona.fromJsonList(UsuarioLoguin);
      });
  }

  obtenerClasificacion() {
    this.servicio.ObtenerClasificacionesExtras().subscribe(clasificacion => {
      this.ObjClasificacion = Clasificacion.fromJsonList(clasificacion);
      this.obtenerProcesos();
    });
  }
  obtenerProcesos() {
    this.servicio.ObtenerProcesosExtra().subscribe(proceso => {
      this.objProceso = ProcesoExtra.fromJsonList(proceso);
    });
  }

  pageChanged(event) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.objActividad.slice(startItem, endItem);
  }

  onSubmit() {
    this.submitted = true;

    if (this.informeForm.invalid) {
      return;
    }

    let d = new Date();
    let ArrayFecha = this.informeForm.controls['txtFecha'].value;
    let fecha1 = new Date(ArrayFecha[0]);
    let fecha1String = this.formatDate(fecha1);
    let fecha2 = new Date(ArrayFecha[1]);
    let fecha2String = this.formatDate(fecha2);
    let slctResponsable = this.informeForm.controls['slcResponsable'].value;
    const nombreResponsable = this.ObjResponsable.find(x => x.id === +slctResponsable).nombre;
    let slcTienda = this.informeForm.controls['slcTienda'].value;

    let arrayMEses = [];
    this.objActividad = [];
    this.contadorConsultas = 0;
    this.contadorEntradas = 0;

    arrayMEses = this.dateRange(fecha1String, fecha2String);

    if ( $.fn.dataTable.isDataTable( 'table' ) ) {
      this.dataTable.destroy();
    } 

    for (const FechaMes of arrayMEses) {
      let date = new Date(FechaMes);
      let mes = date.getMonth();
      let firstDay = new Date(date.getFullYear(), mes, 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      if (fecha1.getMonth() === mes) {
        this.contadorConsultas++;
        let fechafinString = this.formatDate(lastDay);
        if (nombreResponsable === "Administrador de tienda") {

          this.stringConsulta = "Usuario eq '" + slcTienda + "' and Responsable eq '" + nombreResponsable + "' and Fecha ge datetime'" + fecha1String + "T08:00:00.000Z" + "' and Fecha le datetime'" + fechafinString + "T08:00:00.000Z'";
        }
        else if (nombreResponsable === "Jefe de zonas") {
          this.stringConsulta = "Jefe eq '" + slcTienda + "' and Responsable eq '" + nombreResponsable + "' and Fecha ge datetime'" + fecha1String + "T08:00:00.000Z" + "' and Fecha le datetime'" + fechafinString + "T08:00:00.000Z'";
        }

        let month = "" + (lastDay.getMonth() + 1);
        let year = lastDay.getFullYear();
        let NombreLista = "RespuestasActividades" + year + month;
        this.CrearObjetoInforme(NombreLista, this.stringConsulta);
      }
      else if (fecha2.getMonth() === mes) {
        this.contadorConsultas++;
        let fechaInicioString = this.formatDate(firstDay);
        if (nombreResponsable === "Administrador de tienda") {

          this.stringConsulta = "Usuario eq '" + slcTienda + "' and Responsable eq '" + nombreResponsable + "' and Fecha ge datetime'" + fechaInicioString + "T08:00:00.000Z" + "' and Fecha le datetime'" + fecha2String + "T08:00:00.000Z'";
        }
        else if (nombreResponsable === "Jefe de zonas") {
          this.stringConsulta = "Jefe eq '" + slcTienda + "' and Responsable eq '" + nombreResponsable + "' and Fecha ge datetime'" + fechaInicioString + "T08:00:00.000Z" + "' and Fecha le datetime'" + fecha2String + "T08:00:00.000Z'";
        }

        let month = "" + (firstDay.getMonth() + 1);
        let year = firstDay.getFullYear();
        let NombreLista = "RespuestasActividades" + year + month;
        this.CrearObjetoInforme(NombreLista, this.stringConsulta);
      }
      else {
        this.contadorConsultas++;
        let fechaInicioString = this.formatDate(firstDay);
        let fechafinString = this.formatDate(lastDay);
        if (nombreResponsable === "Administrador de tienda") {

          this.stringConsulta = "Usuario eq '" + slcTienda + "' and Responsable eq '" + nombreResponsable + "' and Fecha ge datetime'" + fechaInicioString + "T08:00:00.000Z" + "' and Fecha le datetime'" + fechafinString + "T08:00:00.000Z'";
        }
        else if (nombreResponsable === "Jefe de zonas") {
          this.stringConsulta = "Jefe eq '" + slcTienda + "' and Responsable eq '" + nombreResponsable + "' and Fecha ge datetime'" + fechaInicioString + "T08:00:00.000Z" + "' and Fecha le datetime'" + fechafinString + "T08:00:00.000Z'";
        }

        let month = "" + (firstDay.getMonth() + 1);
        let year = firstDay.getFullYear();
        let NombreLista = "RespuestasActividades" + year + month;
        this.CrearObjetoInforme(NombreLista, this.stringConsulta);
      }

    }

  }
  ObtenerValoresInforme() {
    this.maxPrioridad = this.objActividad.length;
    this.dynamicPrioridadAlta = this.objActividad.filter(x => x.prioridad === "Alta").length;
    this.dynamicPrioridadMedia = this.objActividad.filter(x => x.prioridad === "Media").length;
    this.dynamicPrioridadBaja = this.objActividad.filter(x => x.prioridad === "Baja").length;
    this.actividadesRealizadasAlta = this.objActividad.filter(x => x.prioridad === "Alta" && x.respuesta === true).length;
    this.actividadesRealizadasMedia = this.objActividad.filter(x => x.prioridad === "Media" && x.respuesta === true).length;
    this.actividadesRealizadasBaja = this.objActividad.filter(x => x.prioridad === "Baja" && x.respuesta === true).length;
    this.loading = false;
    if (this.maxPrioridad > 0) {
      this.cantidadRegistros = true;
    }
    else if (this.maxPrioridad === 0) {
      this.cantidadRegistros = false;
    }
    this.AgregarDataTable();
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

  CrearObjetoInforme(NombreLista, stringConsulta) {
    this.loading = true;

    this.servicio.ObtenerRespuestaActividades(NombreLista, stringConsulta)
      .subscribe(respuestaActividad => {
        this.objRespuestaActividad = RespuestaActividad.fromJsonList(respuestaActividad);
        for (const iterator of this.objRespuestaActividad) {
          this.objActividad.push(iterator);
        }
        this.contadorEntradas++;

        if (this.contadorConsultas === this.contadorEntradas) {
          this.ObtenerValoresInforme();
        }
      });
  }


  dateRange(startDate, endDate) {
    let start = startDate.split('-');
    let end = endDate.split('-');
    let startYear = parseInt(start[0]);
    let endYear = parseInt(end[0]);
    let dates = [];

    for (let i = startYear; i <= endYear; i++) {
      let endMonth = i !== endYear ? 11 : parseInt(end[1]) - 1;
      let startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
      for (let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
        let month = j + 1;
        let displayMonth = month < 10 ? '0' + month : month;
        dates.push([i, displayMonth, '01'].join('/'));
      }
    }
    return dates;
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
