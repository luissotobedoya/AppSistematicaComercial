import { Component, TemplateRef, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp.servicio';
import { Usuario } from '../dominio/usuario';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Respuesta } from '../dominio/respuesta';

@Component({
  selector: 'app-mis-actividades',
  templateUrl: './mis-actividades.component.html',
  styleUrls: ['./mis-actividades.component.css'],
})
export class MisActividadesComponent implements OnInit {
  tituloPagina = "Mis actividades";
  usuarioActual: Usuario;
  coleccionRespuestasActividadesUsuario: Respuesta[] = [];
  totalActividades: number;
  actividadesGestionadas: number;
  clasificacionesRespuestas: string[] = [];
  clasificacionSeleccionada: string;
  procesosRespuestas: Respuesta[] = [];
  procesosRespuestasUnicos: string[] = [];
  actividadesRespuestas: Respuesta[] = [];
  actividadRespuestaActualizar: Respuesta;
  valorRespuesta: boolean;
  mostrarProcesos = false;
  mostrarActividades = false;
  mensajeModal: string;
  tituloModal: string;
  public modalRef: BsModalRef;
  mostrarMensajeNoHayProcesos = false;

  constructor(
    private servicio: SPServicio,
    private servicioModal: BsModalService) { }

  ngOnInit() {
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuarioActual = new Usuario(Response.Id, Response.Title, null);
        this.ObtenerActividadesUsuarioActual();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  ObtenerActividadesUsuarioActual() {
    let listaRespuestas = this.ObtenerNombreListaActual();
    let consulta = '<View><Query><Where><And><Eq><FieldRef Name="Fecha"/><Value Type="DateTime" IncludeTimeValue="False"><Today/></Value></Eq><Eq><FieldRef Name="Usuario" LookupId="TRUE" /><Value Type="Lookup">' + this.usuarioActual.id + '</Value></Eq></And></Where></Query></View>';
    this.servicio.ObtenerElementosPorCaml(listaRespuestas, consulta).subscribe(
      (Response) => {
        this.coleccionRespuestasActividadesUsuario = Respuesta.fromJsonList(Response);
        this.totalActividades = this.coleccionRespuestasActividadesUsuario.length;
        this.actividadesGestionadas = this.coleccionRespuestasActividadesUsuario.filter(item => { return item.respuesta === true }).length;
        this.clasificacionesRespuestas = this.ObtenerClasificacionesUnicas(this.coleccionRespuestasActividadesUsuario);
      },
      error => {
        console.log('Error obteniendo las actividades del usuario: ' + error);
      }
    );
  }

  ObtenerNombreListaActual(): string {
    const nombrelista = 'RespuestasActividades';
    let añoActual = new Date().getFullYear();
    let mesActual = ("0" + (new Date().getMonth() + 1)).slice(-2);
    let listaRespuestas = nombrelista + añoActual + mesActual;
    return listaRespuestas;
  }

  ObtenerProcesosPorClasificacion(clasificacion) {
    this.clasificacionSeleccionada = clasificacion;
    this.LimpiarProcesos();
    this.LimpiarActividades();
    this.mostrarProcesos = true;
    this.mostrarActividades = false;
    for (var i = 0; i < this.coleccionRespuestasActividadesUsuario.length; i++) {
      if (this.coleccionRespuestasActividadesUsuario[i].clasificacion == clasificacion) {
        this.procesosRespuestas.push(this.coleccionRespuestasActividadesUsuario[i]);
      }
    }
    this.procesosRespuestasUnicos = this.ObtenerProcesosUnicos(this.procesosRespuestas);
  }

  LimpiarActividades(): any {
    this.actividadesRespuestas = [];
  }

  LimpiarProcesos(): any {
    this.procesosRespuestas = [];
  }

  ObtenerClasificacionesUnicas(coleccionRespuestasActividadesUsuario: Respuesta[]): any {
    return coleccionRespuestasActividadesUsuario.map(item => item.clasificacion).filter((value, index, self) => self.indexOf(value) === index);
  }

  ObtenerProcesosUnicos(procesosRespuestas: Respuesta[]): any {
    return procesosRespuestas.map(item => item.proceso).filter((value, index, self) => self.indexOf(value) === index);
  }

  obtenerActividades(proceso) {
    this.LimpiarActividades();
    this.mostrarActividades = true;
    for (var i = 0; i < this.procesosRespuestas.length; i++) {
      if (this.procesosRespuestas[i].proceso == proceso) {
        this.actividadesRespuestas.push(this.procesosRespuestas[i]);
      }
    }
  }

  actualizarActividad(event, switcheActividad, actividad, template: TemplateRef<any>) {

    this.actividadRespuestaActualizar = actividad;

    switch (this.actividadRespuestaActualizar.tipoValidacion) {
      case "Adjunto":
        this.actualizarActividadAdjuntos(event, switcheActividad, this.actividadRespuestaActualizar, template);
        break;
      case "Checkbox":
        this.actualizarActividadCheckbox(event, this.actividadRespuestaActualizar);
        break;
      case "Checkbox y Aprobación":
        this.actualizarActividadCheckboxAprobacion(this.actividadRespuestaActualizar);
        break;
      case "Checkbox y Reporte":
        this.actualizarActividadCheckboxReporte(this.actividadRespuestaActualizar);
        break;
      case "Reporte":
        this.actualizarActividadReporte(this.actividadRespuestaActualizar);
        break;
      case "Validación":
        this.actualizarActividadValidacion(this.actividadRespuestaActualizar);
        break;
    }
  }

  actualizarActividadValidacion(actividadRespuesta: Respuesta): any {
    throw new Error("Method not implemented.");
  }

  actualizarActividadReporte(actividadRespuesta: Respuesta): any {
    throw new Error("Method not implemented.");
  }

  actualizarActividadCheckboxReporte(actividadRespuesta: Respuesta): any {
    throw new Error("Method not implemented.");
  }

  actualizarActividadCheckboxAprobacion(actividadRespuesta: Respuesta): any {
    throw new Error("Method not implemented.");
  }

  actualizarActividadCheckbox(event: any, actividadRespuesta: Respuesta): any {
    let listaRespuestas = this.ObtenerNombreListaActual();
    if (event.target.checked == false) {
      actividadRespuesta.respuesta = false;
      this.actividadesGestionadas--;
    }
    if (event.target.checked == true) {
      actividadRespuesta.respuesta = true;
      this.actividadesGestionadas++;
    }
    this.servicio.actuaiizarActividad(listaRespuestas, actividadRespuesta).then(
      (respuesta) => {
        console.log("Se actualiza la actividad: " + actividadRespuesta.id);
      }, error => {
        console.log(error);
        alert('Ha ocurrido un error al actualizar la actividad');
      }
    );
  }

  actualizarActividadAdjuntos(event: any, switcheActividad, actividadRespuesta: Respuesta, template: TemplateRef<any>): any {
    let listaRespuestas = this.ObtenerNombreListaActual();
    if(!actividadRespuesta.adjunto){
      if (event.target.checked == false) {
        this.mostrarConfirmacionBorrarAdjuntos(template);
      }
      if (event.target.checked == true) {
        this.mostrarAlertaValidacionAdjunto(switcheActividad, template);
      }
    }
    else{
      if (event.target.checked == false) {
        actividadRespuesta.respuesta = false;
        this.actividadesGestionadas--;
      }
      if (event.target.checked == true) {
        actividadRespuesta.respuesta = true;
        this.actividadesGestionadas++;
      }
      this.servicio.actuaiizarActividad(listaRespuestas, actividadRespuesta).then(
        (respuesta) => {
          this.AgregarAdjuntoActividad(actividadRespuesta);
        }, error => {
          console.log(error);
          alert('Ha ocurrido un error al actualizar la actividad');
        }
      );
    }
  }

  mostrarConfirmacionBorrarAdjuntos(template: TemplateRef<any>): any {

  }

  mostrarAlertaValidacionAdjunto(switcheActividad, template: TemplateRef<any>): any {
    switcheActividad.checked = false;
    this.tituloModal = "No hay soporte";
    this.mensajeModal = "Debes adjuntar un soporte para finalizar o cerrar esta actividad";
    this.modalRef = this.servicioModal.show(template);
  }

  AgregarAdjuntoActividad(actividadRespuestaActualizar: Respuesta): any {
    console.log(actividadRespuestaActualizar);
    let listaRespuestas = this.ObtenerNombreListaActual();
    let nombreArchivo = "SC-" + this.generarllaveSoporte() + "-" + actividadRespuestaActualizar.adjunto.name;
    this.servicio.agregarAdjuntoActividad(listaRespuestas, actividadRespuestaActualizar, nombreArchivo , actividadRespuestaActualizar.adjunto).then(
      (respuesta) => {
        console.log("Actividad actualizada con adjunto: " + actividadRespuestaActualizar.id);
      }, error => {
        console.log(error);
        alert('Ha ocurrido un error al actualizar la actividad');
      }
    );
  }

  generarllaveSoporte(): string{
    var fecha = new Date();
    var valorprimitivo = fecha.valueOf().toString();
    return valorprimitivo;
  }

  subirAdjuntoActividad(fileInput: any, actividad) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      actividad.adjunto = fileInput.target.files[0];
    }
    else{
      actividad.adjunto = null;
    }
  }
}
