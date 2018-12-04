import { Component, OnInit } from "@angular/core";
import { SPServicio } from "../servicios/sp.servicio";
import { JefeZona } from "../dominio/Informe/JefeZona";
import { Clasificacion } from "../dominio/clasificacion";
import { ProcesoExtra } from "../dominio/procesosExtra";
import { Responsable } from "../dominio/Informe/Responsable";
import { RespuestaActividad } from "../dominio/Informe/RespuestaActividad";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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
    informeForm: FormGroup;
    submitted = false;
    maxPrioridad: number;    
    dynamicPrioridadAlta: number;
    // maxPrioridadMedia: number;    
    dynamicPrioridadMedia: number;
    // maxPrioridadBaja: number;    
    dynamicPrioridadBaja: number;
    type: string;
  

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder) {
    this.NombreCampo = ""; 
    this.DisalbeTienda = true;
    this.txtFecha = [];
    this.slctResponsableModel = "";
    this.slctTiendaZonaModel = "";
    this.slctClasificacion = "";
    this.slctProceso = "";
    this.stringConsulta = "";    
    this.maxPrioridad=0;
  }

  ngOnInit() {
    this.informeForm = this.formBuilder.group({
      txtFecha: ["", Validators.required],
      slcResponsable: ["", Validators.required],
      slcTienda: ["", Validators.required]
    });

    this.servicio.obtenerMaestroResponsable().subscribe(responsable => {
      this.ObjResponsable = Responsable.fromJsonList(responsable);
      this.obtenerClasificacion();
    });
  }

  // tslint:disable-next-line:semicolon
  get f() {
    return this.informeForm.controls;
  }

  SeleccionarResponsable(IdResponsable) {
    
    //let IdResponsable = this.slctResponsableModel.id; 
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
        // this.obtenerClasificacion();
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

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.informeForm.invalid) {
      return;
    }

      
    let ArrayFecha = this.informeForm.controls['txtFecha'].value;
    let fecha1 = new Date(ArrayFecha[0]);
    let fecha1String = this.formatDate(fecha1);
    let fecha2 = new Date(ArrayFecha[1]);
    let fecha2String = this.formatDate(fecha2);



    let slctResponsable = this.informeForm.controls['slcResponsable'].value;

    const nombreResponsable = this.ObjResponsable.find(x => x.id === +slctResponsable).nombre;
    let slcTienda = this.informeForm.controls['slcTienda'].value;

    if (nombreResponsable === "Administrador de tienda") {  
      this.stringConsulta = "Fecha ge datetime'" + fecha1String+"T08:00:00.000Z" + "' and Fecha le datetime'" + fecha2String+"T08:00:00.000Z' and Responsable eq '"+nombreResponsable+"' and Usuario eq '"+slcTienda+"'";
    }
    else if(nombreResponsable=== "Jefe de zonas"){
      this.stringConsulta = "Fecha ge datetime'" + fecha1String+"T08:00:00.000Z" + "' and Fecha le datetime'" + fecha2String+"T08:00:00.000Z' and Responsable eq '"+nombreResponsable+"' and Jefe eq '"+slcTienda+"'";
    }
    
    let d = new Date(),
      month = "" + (d.getMonth() + 1),
      year = d.getFullYear();
    //let NombreLista = "RespuestasActividades"+year+month;
    let NombreLista = "RespuestasActividades201811";

    this.servicio
      .ObtenerRespuestaActividades(NombreLista, this.stringConsulta)
      .subscribe(respuestaActividad => {
        this.objRespuestaActividad = RespuestaActividad.fromJsonList(respuestaActividad);
        this.maxPrioridad = this.objRespuestaActividad.length;
        this.dynamicPrioridadAlta = this.objRespuestaActividad.filter(x => x.prioridad==="Alta").length;
        this.dynamicPrioridadMedia = this.objRespuestaActividad.filter(x => x.prioridad==="Media").length;
        this.dynamicPrioridadBaja = this.objRespuestaActividad.filter(x => x.prioridad==="Baja").length;
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
