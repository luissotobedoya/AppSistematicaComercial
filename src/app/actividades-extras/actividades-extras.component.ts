import { Component, OnInit, TemplateRef } from '@angular/core';
import { Clasificacion } from '../dominio/ClasificacionExtra';
import { SPServicio } from '../servicios/sp.servicio';
import { Proceso } from '../dominio/proceso';
import { ProcesoExtra } from '../dominio/procesosExtra';
import { TiendaXJefe } from '../dominio/TiendaXJefe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActividadExtraordinaria } from '../dominio/actividadExtraordinaria';
import { ItemAddResult } from 'sp-pnp-js';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Usuario } from '../dominio/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actividades-extras',
  templateUrl: './actividades-extras.component.html',
  styleUrls: ['./actividades-extras.component.css']
})
export class ActividadesExtrasComponent implements OnInit {
  tituloPagina = "Actividades extraordinarias";
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  minDate: Date;
  maxDate: Date;
  registerForm: FormGroup;
  submitted = false;
  clasificaciones: Clasificacion[] = [];
  ObjProceso: Proceso[] = [];
  ObjTiendas: TiendaXJefe[] = [];
  prioridades: string[] = [];
  tipoActividades: string[] = [];
  Fecha: string;
  diasSeleccionados: any[] = [];
  tiendasSeleccionadas: Number[] = [];
  contadorEntradas: number;
  ContadorSucces: number;
  tituloModal: string;
  mensajeModal: string;
  timer: any;
  public modalRef: BsModalRef;
  loading: boolean;
  actividadExtraordinariaGuardar: ActividadExtraordinaria;
  mostrarDivObservaciones = false;
  fechaGuardar: Date;
  usuarioActual: Usuario;
  ModelPeriodicidad: any = "1";
  ValidatorOpc1: boolean = false;
  ValidatorOpc2: boolean = false;

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private servicioModal: BsModalService, private _localeService: BsLocaleService, private router:Router) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.ValidarPerfilacion();
    this.actividadExtraordinariaGuardar = new ActividadExtraordinaria(null, this.tiendasSeleccionadas, "", "", "", "", "", "");
    this.contadorEntradas = 0;
    this.ContadorSucces = 0;
    this.loading = false;
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.maxDate.setDate(this.maxDate.getDate() + 365000);
    this._localeService.use('engb');
  }

  aplicarTema() {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  ngOnInit() {
    this.aplicarTema();
    this.loading = true;
    this.registerForm = this.formBuilder.group({
      Fecha: ['', Validators.required],
      Clasificacion: ['', Validators.required],
      TipoActividad: ['', Validators.required],
      Proceso: ['', Validators.required],
      prioridad: ['', Validators.required],
      observaciones: [''],
      NombreActividad: ['', Validators.required],
      Periodicidad: [1, Validators.required],
      PeriodicidadMensual: ['', Validators.required],
      diaNumero: [''],
      mesNumero: [''],
      stringNumDia: [0],
      stringDia: [1],
      stringMes: ['']
    });
    this.obtenerClasificacionExtra();
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

  get f() { return this.registerForm.controls; }

  mostrarAlerta(template: TemplateRef<any>, Titulo, Mensaje): any {
    this.tituloModal = Titulo;
    this.mensajeModal = Mensaje;
    this.modalRef = this.servicioModal.show(template);
  }

  obtenerClasificacionExtra() {
    this.servicio.ObtenerClasificacionesExtras().subscribe(
      (Response) => {
        this.clasificaciones = Clasificacion.fromJsonList(Response);
        this.obtenerProcesos();
      }
    );
  }

  obtenerProcesos() {
    this.servicio.ObtenerProcesosExtra().subscribe(
      (Response) => {
        this.ObjProceso = ProcesoExtra.fromJsonList(Response);
        this.obtenerTiendas();
      }
    );
  }

  obtenerTiendas() {
    this.servicio.ObtenerUsuariosXJefe(this.usuarioActual.id).subscribe(
      (ResponseTienda) => {
        this.ObjTiendas = TiendaXJefe.fromJsonList(ResponseTienda);
        this.obtenerTipoActividades();
      }
    );
  }

  obtenerTipoActividades(): any {
    this.servicio.obtenerTiposValidacion().then(
      (Response) => {
        let respuesta = Response;
        this.tipoActividades = respuesta.Choices.results;
        this.obtenerPrioridades();
      }, err => {
        console.log('Error obteniendo tipo de actividades: ' + err);
      }
    );
  }

  obtenerPrioridades(): any {
    this.servicio.obtenerPrioridades().then(
      (Response) => {
        let respuesta = Response;
        this.prioridades = respuesta.Choices.results;
        this.loading = false;
      }, err => {
        console.log('Error obteniendo prioridades: ' + err);
      }
    );
  }

  CambioPeriodicidad(event){
    this.ModelPeriodicidad = event.target.value;
    let pp = this.ModelPeriodicidad;
  }

  seleccionarTienda(TiendasChk) {
    let isChk = TiendasChk.target.checked;
    if (isChk === true) {
      let valueChk = TiendasChk.target.value;
      this.tiendasSeleccionadas.push(parseInt(valueChk));
    }
    else {
      let valueChk = TiendasChk.target.value;
      const index = this.tiendasSeleccionadas.indexOf(valueChk, 0);
      this.tiendasSeleccionadas.splice(index, 1);
    }
  }

  onSubmit(template: TemplateRef<any>) {
    this.submitted = true;
    let Periodicidad = "";
    let PeriodicidadMensual= "";
    if (this.registerForm.invalid) {   
      Periodicidad = this.registerForm.controls['Periodicidad'].value.toString();   
      if (Periodicidad === "1") {
          if (this.diasSeleccionados.length === 0) {
            this.mostrarAlerta(template, "Alerta", "Por favor seleccione al menos un dia en el que desea la actividad");
            return;
          }
      }
      else if (Periodicidad === "2") {
         PeriodicidadMensual = this.registerForm.controls['PeriodicidadMensual'].value.toString();
         if (PeriodicidadMensual ==="Opcion1") {
             let diaNumero = this.registerForm.controls['diaNumero'].value;
             let mesNumero = this.registerForm.controls['mesNumero'].value;
             if (diaNumero ==="" || mesNumero==="") {
                this.mostrarAlerta(template, "Alerta", "Por favor indique el dia o cada cuantos meses desea hacer la actividad");
                this.ValidatorOpc1 = true;
                return;
             }
             else{ 
                this.ValidatorOpc1 = false;                
             }
         }
         else if(PeriodicidadMensual ==="Opcion2"){
          let stringMes = this.registerForm.controls['stringMes'].value;
            if (stringMes ==="") {
                this.mostrarAlerta(template, "Alerta", "Por favor indique la periocidad del dia y cada cuantos meses desea hacer la actividad");
                this.ValidatorOpc2 = true;
                return;
             }
             else{ 
              this.ValidatorOpc2 = false;
              
             }
         }
         else if(PeriodicidadMensual ===""){
          this.mostrarAlerta(template, "Alerta", "Por favor seleccione alguna de las dos opciones de la periodicidad mensual");
          return;
        }
      }
      
      if (this.tiendasSeleccionadas.length === 0) {
        this.mostrarAlerta(template, "Alerta", "Por favor seleccione al menos una tienda");
        return;
      }
      
    }

    Periodicidad = this.registerForm.controls['Periodicidad'].value.toString();   
      if (Periodicidad === "1") {
          if (this.diasSeleccionados.length === 0) {
            this.mostrarAlerta(template, "Alerta", "Por favor seleccione al menos un dia en el que desea la actividad");
            return;
          }
      }
      else if (Periodicidad === "2") {
         PeriodicidadMensual = this.registerForm.controls['PeriodicidadMensual'].value;
         if (PeriodicidadMensual ==="Opcion1") {
             let diaNumero = this.registerForm.controls['diaNumero'].value;
             let mesNumero = this.registerForm.controls['mesNumero'].value;
             if (diaNumero ==="" || mesNumero==="") {
                this.mostrarAlerta(template, "Alerta", "Por favor indique el dia o cada cuantos meses desea hacer la actividad");
                this.ValidatorOpc1 = true;
                return;
             }
             else{ 
                this.ValidatorOpc1 = false;                
             }
         }
         else if(PeriodicidadMensual ==="Opcion2"){
          let stringMes = this.registerForm.controls['stringMes'].value;
            if (stringMes ==="") {
                this.mostrarAlerta(template, "Alerta", "Por favor indique la periocidad del dia y cada cuantos meses desea hacer la actividad");
                this.ValidatorOpc2 = true;
                return;
             }
             else{ 
              this.ValidatorOpc2 = false;
              
             }
         }
         else if(PeriodicidadMensual ===""){
          this.mostrarAlerta(template, "Alerta", "Por favor seleccione alguna de las dos opciones de la periodicidad mensual");
          return;
        }
      }

    // if (this.diasSeleccionados.length === 0) {
    //   this.mostrarAlerta(template, "Alerta", "Por favor seleccione al menos un día en el que desea la actividad");
    //   return;
    // }

    if (this.tiendasSeleccionadas.length === 0) {
      this.mostrarAlerta(template, "Alerta", "Por favor seleccione al menos una tienda");
      return;
    }
    
    if (Periodicidad === "1") {
      this.loading = true;
      let ArrayFecha = this.registerForm.controls['Fecha'].value;
      let inicio = new Date(ArrayFecha[0]);
      let fin = new Date(ArrayFecha[1]);
      let tiempoDif = Math.abs(fin.getTime() - inicio.getTime());
      let diasDif = Math.ceil(tiempoDif / (1000 * 3600 * 24));
      for (let i = 0; i < diasDif + 1; i++) {
        let dt = inicio.getDay();
        const index = this.diasSeleccionados.indexOf(dt.toString(), 0);
        if (index > -1) {
          let FechaActividad = this.AsignarFormatoFecha(inicio);
          this.contadorEntradas++;
          this.actividadExtraordinariaGuardar = this.retornarActividadExtra(new Date(FechaActividad));
          this.guardarAvtividadExtra(this.actividadExtraordinariaGuardar, template);
        }
        inicio.setDate(inicio.getDate() + 1);
      }
    }
    else if (Periodicidad === "2"){
      if (PeriodicidadMensual ==="Opcion1") {
        let diaNumero = this.registerForm.controls['diaNumero'].value;
        let mesNumero = this.registerForm.controls['mesNumero'].value;
        let FechaActividad = this.GenerarActividadesOpc1(diaNumero, mesNumero);
        if (FechaActividad.length >0) {
          FechaActividad.forEach(element => {
            this.contadorEntradas++;
            let FechaActividad = this.AsignarFormatoFecha(element);
            this.actividadExtraordinariaGuardar = this.retornarActividadExtra(new Date(FechaActividad));
            this.guardarAvtividadExtra(this.actividadExtraordinariaGuardar, template);
          });
        }
      }
      else if(PeriodicidadMensual ==="Opcion2"){
        let stringNumDia = this.registerForm.controls['stringNumDia'].value;
        let stringDia = this.registerForm.controls['stringDia'].value;
        let stringMes = this.registerForm.controls['stringMes'].value;
        let ObjFechaActividad = this.GenerarActividadesOpc2(stringNumDia, stringDia, stringMes);
        if (ObjFechaActividad.length >0) {
          ObjFechaActividad.forEach(element => {
            this.contadorEntradas++;
            let FechaActividad = this.AsignarFormatoFecha(element);
            this.actividadExtraordinariaGuardar = this.retornarActividadExtra(new Date(FechaActividad));
            this.guardarAvtividadExtra(this.actividadExtraordinariaGuardar, template);
          });
        }
      }
    }    
  }
  
  GenerarActividadesOpc1(diaNumero, mesNumero) {
    let ArrayFecha = this.registerForm.controls['Fecha'].value;    
    let dates = this.dateRangeOpc1(ArrayFecha[0], ArrayFecha[1], mesNumero, diaNumero);
    return dates;   
  }

  dateRangeOpc1(startDate, endDate, NumeroMeses, DiaActividad) {

      DiaActividad = DiaActividad.toString();
      // let startYear = startDate.getFullYear();
      // let endYear = endDate.getFullYear();
      let stratDate = new Date(startDate);
      let EndDate = new Date(endDate);
      let dates = [];
      let hoy = new Date();
      var M = '' + (hoy.getMonth() + 1),
              d = '' + hoy.getDate(),
              Y = hoy.getFullYear();
      if (M.length < 2) M = '0' + M;
      if (d.length < 2) d = '0' + d;
      let fechaHoy = new Date([Y, M, d].join('/'));
      stratDate.setDate(1);
      for (var index = stratDate; index < EndDate; index.setMonth(index.getMonth() + NumeroMeses)) {
          var month = '' + (index.getMonth() + 1),
              day = '' + index.getDate(),
              year = index.getFullYear();
  
          if (month.length < 2) month = '0' + month;
          if (DiaActividad.length < 2) DiaActividad = '0' + DiaActividad;
          let fecha = new Date([year, month, DiaActividad].join('/'));
          
          if ( fecha >= fechaHoy) {
            dates.push(fecha);
          }        
      }
      return dates; 
}

GenerarActividadesOpc2(stringNumDia, stringDia, stringMes){
  let ArrayFecha = this.registerForm.controls['Fecha'].value;
  let inicio = new Date(ArrayFecha[0]);
  let fin = new Date(ArrayFecha[1]);
  let RangoMeses = this.dateRange(inicio, fin, stringMes);
  let dates = [];
  RangoMeses.forEach(element => {
    let Fecha = this.FechasMesAMes(element, stringDia, stringNumDia);
    if (Fecha !== "") {
      dates.push(Fecha);
    }    
  });
  return dates;
}

dateRange(startDate, endDate, NumeroMes) {
    
  let stratDate = new Date(startDate);
  let EndDate = new Date(endDate);  
  let dates = [];

  stratDate.setDate(1);
  for (let index = stratDate; index < EndDate; index.setMonth(index.getMonth() + NumeroMes)) {
    let month = '' + (index.getMonth() + 1),
          day = '' + index.getDate(),
          year = index.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      dates.push([year, month, day].join('/'));
  }
  return dates;
}

FechasMesAMes(fecha, stringDia, stringNumDia) {
  let FechaReturn = "";
  let Dia = stringDia;
  let NumeroDia = stringNumDia;
  let date = new Date(fecha);
  let d = date || new Date(),
      month = d.getMonth(),
      mondays = [];

  let fehcaHoy = new Date();
  let mesHoy = fehcaHoy.getMonth();

  d.setDate(1);
  // Get the first Monday in the month
  while (d.getDay() !== parseInt(Dia)) {
      d.setDate(d.getDate() + 1);
  }
  // Get all the other Mondays in the month
  while (d.getMonth() === month) {
      mondays.push(new Date(d.getTime()));
      d.setDate(d.getDate() + 7);
  }

  if (fehcaHoy <= mondays[parseInt(NumeroDia)]) {
      FechaReturn = mondays[parseInt(NumeroDia)];
  }

  return FechaReturn;

}

  private AsignarFormatoFecha(FechaActividad: Date) {
    let diaActividadExtraordinaria = FechaActividad.getDate();
    let mesActividadExtraordinaria = FechaActividad.getMonth();
    let anoActividadExtraordinaria = FechaActividad.getFullYear();
    let hoy = new Date();
    let horas = FechaActividad.getHours() === 0 ? hoy.getHours() : FechaActividad.getHours();
    let minutos = FechaActividad.getMinutes() === 0 ? 1 : FechaActividad.getMinutes();
    let segundos = FechaActividad.getSeconds() === 0 ? 1 : FechaActividad.getSeconds();
    let fechaRetornar = new Date(anoActividadExtraordinaria, mesActividadExtraordinaria, diaActividadExtraordinaria, horas, minutos, segundos).toISOString();
    return fechaRetornar;
  }

  guardarAvtividadExtra(actividadExtraordinariaGuardar: ActividadExtraordinaria, template: TemplateRef<any>): any {
    this.servicio.agregarActividadExtraordinaria(actividadExtraordinariaGuardar).then(
      (iar: ItemAddResult) => {
        this.ContadorSucces++;
        if (this.contadorEntradas === this.ContadorSucces) {
          this.loading = false;
          this.mostrarAlerta(template, "Guardado con éxito", "La actividad extraordinaria se ha guardado con éxito");
          this.timer = setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }, err => {
        alert('Fail create!!');
      }
    );
  }

  retornarActividadExtra(fecha): ActividadExtraordinaria {
    this.actividadExtraordinariaGuardar.fecha = fecha;
    this.actividadExtraordinariaGuardar.usuariosId = this.tiendasSeleccionadas;
    this.actividadExtraordinariaGuardar.actividad = this.registerForm.controls['NombreActividad'].value;
    this.actividadExtraordinariaGuardar.clasificacion = this.registerForm.controls['Clasificacion'].value;
    this.actividadExtraordinariaGuardar.proceso = this.registerForm.controls['Proceso'].value;
    this.actividadExtraordinariaGuardar.tipoValidacion = this.registerForm.controls['TipoActividad'].value;
    this.actividadExtraordinariaGuardar.prioridad = this.registerForm.controls["prioridad"].value;
    this.actividadExtraordinariaGuardar.observaciones = this.registerForm.controls["observaciones"].value;
    return this.actividadExtraordinariaGuardar;
  }

  checkValueDias(eventChk) {
    let isChk = eventChk.target.checked;
    if (isChk === true) {
      let valueChk = eventChk.target.value;
      this.diasSeleccionados.push(valueChk);
    }
    else {
      let valueChk = eventChk.target.value;
      const index = this.diasSeleccionados.indexOf(valueChk, 0);
      this.diasSeleccionados.splice(index, 1);
    }
  }

  mostrarObservaciones(event) {
    let valor = event.target.value;
    if (valor == "Adjunto" || valor == "Checkbox y Aprobación") {
      this.mostrarDivObservaciones = true;
    } else {
      this.mostrarDivObservaciones = false;
    }
  }
}
