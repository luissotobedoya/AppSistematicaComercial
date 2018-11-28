import { Component, OnInit, TemplateRef } from '@angular/core';
import { Clasificacion } from '../dominio/ClasificacionExtra';
import { SPServicio } from '../servicios/sp.servicio';
import { Proceso } from '../dominio/proceso';
import { ProcesoExtra } from '../dominio/procesosExtra';
import { TiendaXJefe } from '../dominio/TiendaXJefe';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActividadExtraordinaria } from '../dominio/actividadExtraordinaria';
import { ItemAddResult } from 'sp-pnp-js';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-actividades-extras',
  templateUrl: './actividades-extras.component.html',
  styleUrls: ['./actividades-extras.component.css']
})
export class ActividadesExtrasComponent implements OnInit {


  registerForm: FormGroup;
  submitted = false;
  clasificaciones: Clasificacion[] = [];
  ObjProceso: Proceso[] = [];
  ObjTiendas: TiendaXJefe[] = [];
  Fecha: string;
  diasSeleccionados: any[] = [];
  tiendasSeleccionadas: Number[] = [];
  contadorEntradas:number;
  ContadorSucces: number;
  tituloModal:string;
  mensajeModal:string;
  timer: any;
  public modalRef: BsModalRef;
  

  actividadExtraordinariaGuardar: ActividadExtraordinaria;
  

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder,
    private servicioModal: BsModalService) {
    this.actividadExtraordinariaGuardar = new ActividadExtraordinaria(null, this.tiendasSeleccionadas, "", "", "", "");
    this.contadorEntradas=0;
    this.ContadorSucces=0;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      Fecha: ['', Validators.required],
      Clasificacion: ['', Validators.required],
      TipoActividad: ['', Validators.required],
      Proceso: ['', Validators.required],
      NombreActividad: ['', Validators.required]
    });
    this.obtenerClasificacionExtra();
  }

  get f() { return this.registerForm.controls; }


  mostrarAlerta(template: TemplateRef<any>,Titulo,Mensaje): any {
    
    this.tituloModal = Titulo;
    this.mensajeModal = Mensaje;
    this.modalRef = this.servicioModal.show(template);
  }

  obtenerClasificacionExtra() {
    this.servicio.ObtenerClasificacionesExtras().subscribe(
      (Response) => {
        this.clasificaciones = Clasificacion.fromJsonList(Response);
        console.log(this.clasificaciones);
        this.obtenerProcesos();
      }
    );
  }

  obtenerProcesos() {
    this.servicio.ObtenerProcesosExtra().subscribe(
      (Response) => {
        this.ObjProceso = ProcesoExtra.fromJsonList(Response);
        console.log(this.ObjProceso);
        this.obtenerTiendas();
      }
    );
  }

  obtenerTiendas() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        let Usuario = Response.Id;
        this.servicio.ObtenerTiendaXJefe(Usuario).subscribe(
          (ResponseTienda) => {
            this.ObjTiendas = TiendaXJefe.fromJsonList(ResponseTienda);
            console.log(this.ObjTiendas);
          }
        );
        console.log(Usuario);
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

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      if (this.diasSeleccionados.length===0) {      
        this.mostrarAlerta(template,"Alerta","Por favor seleccione al menos un dia en el que desea la actividad");
        return;
      }
  
      if (this.tiendasSeleccionadas.length===0) {      
        this.mostrarAlerta(template,"Alerta","Por favor seleccione al menos una tienda");
        return;
      }
      return;
    }

    if (this.diasSeleccionados.length===0) {      
      this.mostrarAlerta(template,"Alerta","Por favor seleccione al menos un dia en el que desea la actividad");
      return;
    }

    if (this.tiendasSeleccionadas.length===0) {      
      this.mostrarAlerta(template,"Alerta","Por favor seleccione al menos una tienda");
      return;
    }

    let ArrayFecha = this.registerForm.controls['Fecha'].value;
    let inicio = new Date(ArrayFecha[0]); //Fecha inicial

    let fin = new Date(ArrayFecha[1]); //Fecha final
    let tiempoDif = Math.abs(fin.getTime() - inicio.getTime());
    let diasDif = Math.ceil(tiempoDif / (1000 * 3600 * 24));

    for (let i = 0; i < diasDif + 1; i++) {

      let dt = inicio.getDay();
      const index = this.diasSeleccionados.indexOf(dt.toString(), 0);

      if (index > -1) {
        let FechaActividad = inicio;
        this.contadorEntradas++;
        this.actividadExtraordinariaGuardar = this.retornarActividadExtra(FechaActividad.toISOString());
        this.guardarAvtividadExtra(this.actividadExtraordinariaGuardar,template);
        console.log(this.actividadExtraordinariaGuardar);
      }
      inicio.setDate(inicio.getDate() + 1);
    }
  }

  guardarAvtividadExtra(actividadExtraordinariaGuardar: ActividadExtraordinaria, template: TemplateRef<any>): any {
    this.servicio.agregarActividadExtraordinaria(actividadExtraordinariaGuardar).then(
      (iar: ItemAddResult) => {
        this.ContadorSucces++;
        if (this.contadorEntradas===this.ContadorSucces) {
          this.mostrarAlerta(template,"Guardado con éxito","La actividad extraordinaria se ha guardado con éxito");
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
  
}
