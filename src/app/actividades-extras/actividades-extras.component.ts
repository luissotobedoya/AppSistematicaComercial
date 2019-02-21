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

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder,
    private servicioModal: BsModalService, private _localeService: BsLocaleService) {
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
      NombreActividad: ['', Validators.required]
    });
    this.obtenerClasificacionExtra();
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
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        let Usuario = Response.Id;
        this.servicio.ObtenerUsuariosXJefe(Usuario).subscribe(
          (ResponseTienda) => {
            this.ObjTiendas = TiendaXJefe.fromJsonList(ResponseTienda);
            this.obtenerTipoActividades();
          }
        );
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
    if (this.registerForm.invalid) {
      if (this.diasSeleccionados.length === 0) {
        this.mostrarAlerta(template, "Alerta", "Por favor seleccione al menos un dia en el que desea la actividad");
        return;
      }

      if (this.tiendasSeleccionadas.length === 0) {
        this.mostrarAlerta(template, "Alerta", "Por favor seleccione al menos una tienda");
        return;
      }
      return;
    }

    if (this.diasSeleccionados.length === 0) {
      this.mostrarAlerta(template, "Alerta", "Por favor seleccione al menos un día en el que desea la actividad");
      return;
    }

    if (this.tiendasSeleccionadas.length === 0) {
      this.mostrarAlerta(template, "Alerta", "Por favor seleccione al menos una tienda");
      return;
    }

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

  private AsignarFormatoFecha(FechaActividad: Date) {
    let diaActividadExtraordinaria = FechaActividad.getDate();
    let mesActividadExtraordinaria = FechaActividad.getMonth();
    let anoActividadExtraordinaria = FechaActividad.getFullYear();
    let fechaRetornar = new Date(anoActividadExtraordinaria, mesActividadExtraordinaria, diaActividadExtraordinaria, FechaActividad.getHours(), FechaActividad.getMinutes(), FechaActividad.getSeconds()).toISOString();
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
