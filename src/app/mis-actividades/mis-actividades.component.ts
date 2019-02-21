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
  mensajeConfirmacion: string;
  tituloModal: string;
  switcheActividadSeleccionada: any;
  public modalRef: BsModalRef;
  listaRespuestas: string;
  fileuploadActual;
  loading: boolean;
  tieneActividades: boolean;
  textoNoActividades: string;

  constructor(
    private servicio: SPServicio,
    private servicioModal: BsModalService) {
    this.listaRespuestas = this.ObtenerNombreListaActual();
    this.tieneActividades = false;
    this.textoNoActividades = '';
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuarioActual = new Usuario(Response.Id, Response.Title, null);
        this.ObtenerRolUsuario();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
        this.loading = false;
      }
    )
  }

  ObtenerRolUsuario() {
    this.servicio.ObtenerRolUsuarioActual(this.usuarioActual.id).subscribe(
      (Response) => {
        this.usuarioActual.rol = Response[0].Responsable.Title;
        this.ObtenerActividadesUsuarioActual();
      }, err => {
        console.log('Error obteniendo rol de usuario: ' + err);
      }
    )
  }

  ObtenerActividadesUsuarioActual() {
    let fechaActual = this.ObtenerFormatoFecha(this.addDays(new Date(),1)) + "T08:00:00Z";
      this.servicio.obtenerActividadesDelDia(this.listaRespuestas, this.usuarioActual.id, this.usuarioActual.rol, fechaActual).subscribe(
        (Response) => {
          this.coleccionRespuestasActividadesUsuario = Respuesta.fromJsonList(Response);
          this.totalActividades = this.coleccionRespuestasActividadesUsuario.length;
          if(this.totalActividades > 0){
            this.tieneActividades = true;
            this.textoNoActividades = '';
            this.actividadesGestionadas = this.coleccionRespuestasActividadesUsuario.filter(item => { return item.respuesta === true }).length;
            this.clasificacionesRespuestas = this.ObtenerClasificacionesUnicas(this.coleccionRespuestasActividadesUsuario);
          }else{
            this.tieneActividades = false;
            this.actividadesGestionadas = 0;
            this.textoNoActividades = "No hay actividades para este usuario y este rol";
          }
          this.loading = false;
        },
        error => {
          console.log('Error obteniendo las actividades del usuario: ' + error);
        }
      );
  }

   addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  ObtenerFormatoFecha(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  ObtenerNombreListaActual(): string {
    const nombrelista = 'RespuestasActividades';
    let añoActual = new Date().getFullYear();
    let mesActual = ("0" + (new Date().getMonth() + 1)).slice(-2);
    let listaRespuestas = nombrelista + añoActual + mesActual;
    return listaRespuestas;
  }

  ObtenerProcesosPorClasificacion(clasificacion) {
    this.loading = true;
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
    this.loading = false;
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
    this.loading = true;
    this.LimpiarActividades();
    this.mostrarActividades = true;
    for (var i = 0; i < this.procesosRespuestas.length; i++) {
      if (this.procesosRespuestas[i].proceso == proceso) {
        this.actividadesRespuestas.push(this.procesosRespuestas[i]);
      }
    }
    this.loading = false;
  }

  actualizarActividad(event, switcheActividad, actividad, template: TemplateRef<any>, templateConfirmacion: TemplateRef<any>) {
    this.loading = true;
    this.actividadRespuestaActualizar = actividad;
    switch (this.actividadRespuestaActualizar.tipoValidacion.toLowerCase()) {
      case "adjunto":
        this.actualizarActividadAdjuntos(event, switcheActividad, this.actividadRespuestaActualizar, template, templateConfirmacion);
        break;
      case "checkbox":
        this.actualizarActividadCheckbox(event, this.actividadRespuestaActualizar);
        break;
      case "checkbox y aprobación":
        this.actualizarActividadCheckboxAprobacion(event, switcheActividad, this.actividadRespuestaActualizar, template, templateConfirmacion);
        break;
    }
  }

  actualizarActividadCheckboxAprobacion(event: any, switcheActividad, actividadRespuesta: Respuesta, template: TemplateRef<any>, templateConfirmacion: TemplateRef<any>): any {
    if (event.target.checked == false) {
      this.mostrarConfirmacionBorrarAdjuntos(switcheActividad, actividadRespuesta, templateConfirmacion);
    } else {
      if (event.target.checked == true) {
        if (!actividadRespuesta.adjunto) {
          this.mostrarAlertaValidacionAdjunto(switcheActividad, template);
        }
        else {
          actividadRespuesta.respuesta = true;
          actividadRespuesta.aprobacionActividad = "Sin aprobar";
          this.servicio.actualizarActividad(this.listaRespuestas, actividadRespuesta).then(
            (respuesta) => {
              this.AgregarAdjuntoActividad(actividadRespuesta);
            }, error => {
              console.log(error);
              alert('Ha ocurrido un error al actualizar la actividad');
            }
          );
        }
      }
    }
  }

  actualizarActividadCheckbox(event: any, actividadRespuesta: Respuesta): any {
    if (event.target.checked == false) {
      actividadRespuesta.respuesta = false;
    } else {
      if (event.target.checked == true) {
        actividadRespuesta.respuesta = true;
      }
    }
    this.servicio.actualizarActividad(this.listaRespuestas, actividadRespuesta).then(
      (respuesta) => {
        if (actividadRespuesta.respuesta == false) {
          this.actividadesGestionadas--;
        }
        if (actividadRespuesta.respuesta == true) {
          this.actividadesGestionadas++;
        }
        this.loading = false;
      }, error => {
        console.log(error);
        this.loading = false;
        alert('Ha ocurrido un error al actualizar la actividad');
      }
    );
  }

  actualizarActividadAdjuntos(event: any, switcheActividad, actividadRespuesta: Respuesta, template: TemplateRef<any>, templateConfirmacion: TemplateRef<any>): any {
    if (event.target.checked == false) {
      this.mostrarConfirmacionBorrarAdjuntos(switcheActividad, actividadRespuesta, templateConfirmacion);
    } else {
      if (event.target.checked == true) {
        if (!actividadRespuesta.adjunto) {
          this.mostrarAlertaValidacionAdjunto(switcheActividad, template);
        }
        else {
          actividadRespuesta.respuesta = true;
          this.servicio.actualizarActividad(this.listaRespuestas, actividadRespuesta).then(
            (respuesta) => {
              this.AgregarAdjuntoActividad(actividadRespuesta);
            }, error => {
              console.log(error);
              this.loading = false;
              alert('Ha ocurrido un error al actualizar la actividad');
            }
          );
        }
      }
    }
  }

  mostrarConfirmacionBorrarAdjuntos(switcheActividad, actividadRespuesta: Respuesta, template: TemplateRef<any>): any {
    this.loading = false;
    switcheActividad.checked = true;
    this.actividadRespuestaActualizar = actividadRespuesta;
    this.switcheActividadSeleccionada = switcheActividad;
    this.mensajeConfirmacion = "¿Está seguro de reiniciar la actividad, tenga en cuenta que esto borrará el soporte?";
    this.modalRef = this.servicioModal.show(template, { class: 'modal-lg' });
  }

  mostrarAlertaValidacionAdjunto(switcheActividad, template: TemplateRef<any>): any {
    this.loading = false;
    switcheActividad.checked = false;
    this.tituloModal = "No hay soporte";
    this.mensajeModal = "Debes adjuntar un soporte para finalizar o cerrar esta actividad";
    this.modalRef = this.servicioModal.show(template);
  }

  AgregarAdjuntoActividad(actividadRespuestaActualizar: Respuesta): any {
    let nombreArchivo = "SC-" + this.generarllaveSoporte() + "-" + actividadRespuestaActualizar.adjunto.name;
    this.servicio.agregarAdjuntoActividad(this.listaRespuestas, actividadRespuestaActualizar, nombreArchivo, actividadRespuestaActualizar.adjunto).then(
      (respuesta) => {
        actividadRespuestaActualizar.adjunto = null;
        this.actividadesGestionadas++;
        this.loading = false;
      }, error => {
        console.log(error);
        this.loading = false;
        alert('Ha ocurrido un error al actualizar la actividad');
      }
    );
  }

  generarllaveSoporte(): string {
    var fecha = new Date();
    var valorprimitivo = fecha.valueOf().toString();
    return valorprimitivo;
  }

  subirAdjuntoActividad(fileInput: any, actividad) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      actividad.adjunto = fileInput.target.files[0];
      this.fileuploadActual = fileInput.srcElement.value;
    }
    else {
      actividad.adjunto = null;
    }
  }

  confirmar(): void {
    let adjuntoBorrar: string;
    this.servicio.obtenerAdjuntos(this.listaRespuestas, this.actividadRespuestaActualizar).then(
      (respuesta) => {
        adjuntoBorrar = respuesta[0].FileName;
        this.actividadRespuestaActualizar.respuesta = false;
        this.actividadRespuestaActualizar.aprobacionActividad = "";
        this.ActualizarActividadyBorrarAdjuntos(this.actividadRespuestaActualizar, adjuntoBorrar);
      }, error => {
        console.log(error);
      }
    );
  }

  ActualizarActividadyBorrarAdjuntos(actividadRespuesta: Respuesta, adjuntoBorrar): any {
    this.servicio.actualizarActividad(this.listaRespuestas, actividadRespuesta).then(
      (respuesta) => {
        this.borrarAdjuntosActividad(actividadRespuesta, adjuntoBorrar);
      }, error => {
        console.log(error);
        alert('Ha ocurrido un error al actualizar la actividad');
      }
    );
  }

  borrarAdjuntosActividad(actividadRespuesta: Respuesta, adjuntoBorrar: string): any {
    this.servicio.borrarAdjunto(this.listaRespuestas, actividadRespuesta, adjuntoBorrar).then(
      (respuesta) => {
        this.actividadesGestionadas--;
        this.modalRef.hide();
        this.switcheActividadSeleccionada.checked = false;
        this.LimpiarControlAdjunto(actividadRespuesta.id);
      }, error => {
        console.log(error);
      }
    );
  }

  LimpiarControlAdjunto(idControlAdjunto){
      (<HTMLInputElement>document.getElementById("adjunto-"+idControlAdjunto)).value = null;
  }

  declinar(): void {
    this.switcheActividadSeleccionada.checked = true;
    this.modalRef.hide();
  }
}
