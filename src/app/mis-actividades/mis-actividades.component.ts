import { Component, TemplateRef, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp.servicio';
import { Usuario } from '../dominio/usuario';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Respuesta } from '../dominio/respuesta';
import { Actividades} from '../mis-actividades/Actividades';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
// import { Actividad } from '../dominio/actividad';
// import { error } from '@angular/compiler/src/util';
// import { find } from 'cfb/types';


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
  procesosRespuestas: Actividades[] = [];
  procesosRespuestasUnicos: string[] = [];
  actividadesRespuestas: Respuesta[] = [];
  actividadRespuestaActualizar;
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
  ActividadesGenerales: any;
  IdRegistroActividad: number;
  ActividadesExtras: any;
  ActividadesGeneralesyExtras: any;
  bibliotecaRespuestas: string;

  constructor(private servicio: SPServicio, private servicioModal: BsModalService, private router: Router) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.ValidarPerfilacion();
    this.listaRespuestas = this.ObtenerNombreListaActual();   
    this.tieneActividades = false;
    this.textoNoActividades = '';
    this.loading = false;
  }

  private ValidarPerfilacion() {
    if (this.usuarioActual != null) {
      if (this.usuarioActual.rol != null) {
        switch (this.usuarioActual.rol.toLowerCase()) {
          case "administrador de tienda":
            console.log("perfilación correcta");
            break;
          case "jefe de zona":
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

  ngOnInit() {
    this.loading = true;
    this.ObtenerActividadesUsuarioActual();
  }

  ObtenerActividadesUsuarioActual() {
    let fechaActual = this.ObtenerFormatoFecha(new Date());
    // let fechaActual = "2019-09-13";
    // this.listaRespuestas = "RespuestasActividades201909"
    this.servicio.obtenerActividadesDelDia(this.listaRespuestas, this.usuarioActual.id, this.usuarioActual.rol, fechaActual).subscribe(
      (Response) => {
        this.coleccionRespuestasActividadesUsuario = Respuesta.fromJsonList(Response);
        if (this.coleccionRespuestasActividadesUsuario.length > 0) {
          this.ActividadesGenerales = this.coleccionRespuestasActividadesUsuario[0].jsonActividad;
          this.ActividadesExtras = this.coleccionRespuestasActividadesUsuario[0].jsonActividadExtra;          
          this.ActividadesGeneralesyExtras = this.ActividadesExtras !== ""? this.ActividadesGenerales.concat(this.ActividadesExtras): this.ActividadesGenerales;
          this.totalActividades = this.ActividadesGenerales.length + this.ActividadesExtras.length;
          this.IdRegistroActividad = this.coleccionRespuestasActividadesUsuario[0].id;
          if(this.totalActividades > 0){
            this.tieneActividades = true;
            this.textoNoActividades = '';
            this.actividadesGestionadas = this.ActividadesGeneralesyExtras.filter(item=> {return item.respuesta === true}).length;
            this.clasificacionesRespuestas = this.ObtenerClasificacionesUnicas(this.ActividadesGeneralesyExtras);
          }
          else{
            this.tieneActividades = false;
            this.actividadesGestionadas = 0;
            this.textoNoActividades = "No hay actividades para este usuario y este rol";
          }
          
         this.servicio.obtenerAdjuntosRegistroxUsuario(this.bibliotecaRespuestas, this.IdRegistroActividad).then(
           (respuesta)=>{
              this.AnexarRutaAdjunto(respuesta);
           }
         ).catch(
           (error)=>{
             console.error(error);
           }
         )        
        } 
        this.loading = false; 
              
      },
      error => {
        console.log('Error obteniendo las actividades del usuario: ' + error);
      }
    );
  }
  AnexarRutaAdjunto(respuesta): any {    
    respuesta.map(x=> {
      this.ActividadesGeneralesyExtras.find((j)=>{
        parseInt(j.id) === x.IdActividad ? this.AgregarRuta(j.id, x.ServerRedirectedEmbedUri): null
      });
    });      
  }

  AgregarRuta(id, ruta){
    let index = this.ActividadesGeneralesyExtras.findIndex(x=> x.id=== id);
    this.ActividadesGeneralesyExtras[index]["RutaAdjunto"] = ruta;
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
    const nombreBiblioteca = 'AdjuntoActividades';
    let añoActual = new Date().getFullYear();
    let mesActual = ("0" + (new Date().getMonth() + 1)).slice(-2);
    let listaRespuestas = nombrelista + añoActual + mesActual;
    this.bibliotecaRespuestas  = nombreBiblioteca + añoActual + mesActual;
    return listaRespuestas;
  }

  ObtenerProcesosPorClasificacion(clasificacion) {
    this.loading = true;
    this.clasificacionSeleccionada = clasificacion;
    this.LimpiarProcesos();
    this.LimpiarActividades();
    this.mostrarProcesos = true;
    this.mostrarActividades = false;
    for (var i = 0; i < this.ActividadesGeneralesyExtras.length; i++) {
      if (this.ActividadesGeneralesyExtras[i].clasificacion == clasificacion) {
        this.procesosRespuestas.push(this.ActividadesGeneralesyExtras[i]);
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

  ObtenerClasificacionesUnicas(procesosRespuestas): any {
    return procesosRespuestas.map(item => item.clasificacion).filter((value, index, self) => self.indexOf(value) === index);
  }

  ObtenerProcesosUnicos(ActividadesGenerales): any {
    return ActividadesGenerales.map(item => item.proceso).filter((value, index, self) => self.indexOf(value) === index);
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

  async actualizarActividadCheckboxAprobacion(event: any, switcheActividad, actividadRespuesta, template: TemplateRef<any>, templateConfirmacion: TemplateRef<any>): Promise<any> {
    if (event.target.checked == false) {
      this.mostrarConfirmacionBorrarAdjuntos(switcheActividad, actividadRespuesta, templateConfirmacion);
    } else {
      if (event.target.checked == true) {
        if (!actividadRespuesta.adjunto) {
          this.mostrarAlertaValidacionAdjunto(switcheActividad, template);
        }
        else {
          //actividadRespuesta.respuesta = true;
          //actividadRespuesta.aprobacionActividad = "Sin aprobar";
          let RutaArchivo = ""; 
          let ObjGuardar;
          let ObjAdjunto;
          if (actividadRespuesta.TipoActividad === "General") {
            
            let id = this.ActividadesGenerales.findIndex(x => x.id === actividadRespuesta.id)
            this.ActividadesGenerales[id].respuesta = true;
            this.ActividadesGenerales[id].aprobacionActividad = "Sin aprobar";
            ObjAdjunto = this.ActividadesGenerales[id].adjunto;
            RutaArchivo = await this.AgregarAdjuntoActividad(ObjAdjunto, actividadRespuesta.id);

            this.ActividadesGenerales[id].respuesta = true;
            if (this.ActividadesGenerales[id]["UrlArchivo"] === undefined) {
              this.ActividadesGenerales[id]["UrlArchivo"] = RutaArchivo;
            }
            else {
              this.ActividadesGenerales[id].UrlArchivo = RutaArchivo;
            }
            this.ActividadesGenerales[id].adjunto = true; 
            this.ActividadesGenerales[id].adjuntoOk = true;
            let respuesta = JSON.stringify(this.ActividadesGenerales);
            ObjGuardar = {
              Json: respuesta
            }            
          }
          else if(actividadRespuesta.TipoActividad === "Extra"){
            let ObjAdjuntoExtra: File;
            let id = this.ActividadesExtras.findIndex(x => x.id === actividadRespuesta.id)
            this.ActividadesExtras[id].respuesta = true;
            this.ActividadesExtras[id].aprobacionActividad = "Sin aprobar";
            ObjAdjuntoExtra = this.ActividadesExtras[id].adjunto;

            RutaArchivo = await this.AgregarAdjuntoActividad(ObjAdjuntoExtra, actividadRespuesta.id);
            this.ActividadesExtras[id].respuesta = true;
            if (this.ActividadesExtras[id]["UrlArchivo"] === undefined) {
              this.ActividadesExtras[id]["UrlArchivo"] = RutaArchivo;
            }
            else{
              this.ActividadesExtras[id].UrlArchivo = RutaArchivo;
            }


            this.ActividadesExtras[id].adjunto = true; 
            this.ActividadesExtras[id].adjuntoOk = true;
            let respuesta = JSON.stringify(this.ActividadesExtras);
            ObjGuardar = {
              JsonExtraordinario: respuesta
            }            
          } 
          
          this.servicio.actualizarActividad(this.listaRespuestas, this.IdRegistroActividad, ObjGuardar).then(
            (respuesta) => {
              // this.AgregarAdjuntoActividad(ObjAdjuntoExtra, actividadRespuesta.id);
              this.actividadRespuestaActualizar.adjunto = null;
              this.actividadesGestionadas++;
              this.loading = false;
            }, error => {
              console.log(error);
              alert('Ha ocurrido un error al actualizar la actividad');
            }
          );
          
        }
      }
    }
  }

  actualizarActividadCheckbox(event: any, actividadRespuesta): any {
    let id;
    let JsonaEnviar;
    let ObjGuardar;
    if (event.target.checked == false) {
      if (actividadRespuesta.TipoActividad === "General") {
        id = this.ActividadesGenerales.findIndex(x => x.id === actividadRespuesta.id)
        this.ActividadesGenerales[id].respuesta = false;
        // actividadRespuesta.respuesta = "false";
        let respuesta = JSON.stringify(this.ActividadesGenerales);
        ObjGuardar = {
          Json: respuesta
        }
      }
      else if (actividadRespuesta.TipoActividad === "Extra") {
        id = this.ActividadesExtras.findIndex(x => x.id === actividadRespuesta.id)
        this.ActividadesExtras[id].respuesta = false;
        // actividadRespuesta.respuesta = "false";
        let respuesta = JSON.stringify(this.ActividadesExtras);
        ObjGuardar = {
          JsonExtraordinario: respuesta
        }
      }      
      
    } else {
      if (event.target.checked == true) {
        if (actividadRespuesta.TipoActividad === "General") {
          id = this.ActividadesGenerales.findIndex(x => x.id === actividadRespuesta.id)
          this.ActividadesGenerales[id].respuesta = true;
          // actividadRespuesta.respuesta = "true";
          let respuesta = JSON.stringify(this.ActividadesGenerales);
          ObjGuardar = {
            Json: respuesta
          }
        }
        else if (actividadRespuesta.TipoActividad === "Extra") {
          id = this.ActividadesExtras.findIndex(x => x.id === actividadRespuesta.id)
          this.ActividadesExtras[id].respuesta = true;
          // actividadRespuesta.respuesta = "false";
          let respuesta = JSON.stringify(this.ActividadesExtras);
          ObjGuardar = {
            JsonExtraordinario: respuesta
          }
        }        
      }
    }    
    this.servicio.actualizarActividad(this.listaRespuestas, this.IdRegistroActividad, ObjGuardar).then(
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

  async actualizarActividadAdjuntos(event: any, switcheActividad, actividadRespuesta, template: TemplateRef<any>, templateConfirmacion: TemplateRef<any>): Promise<any> {
    if (event.target.checked == false) {
      this.mostrarConfirmacionBorrarAdjuntos(switcheActividad, actividadRespuesta, templateConfirmacion);
    } else {
      if (event.target.checked == true) {
        if (!actividadRespuesta.adjunto) {
          this.mostrarAlertaValidacionAdjunto(switcheActividad, template);
        }
        else {
          actividadRespuesta.respuesta = true;
          let JsonaEnviar;
          let ObjAdjunto;
          let ObjGuardar;
          let RutaArchivo = ""; 
          if (actividadRespuesta.TipoActividad === "General") {            
            let id = this.ActividadesGenerales.findIndex(x => x.id === actividadRespuesta.id);
            ObjAdjunto = this.ActividadesGenerales[id].adjunto;            
            RutaArchivo = await this.AgregarAdjuntoActividad(ObjAdjunto, actividadRespuesta.id);

            this.ActividadesGenerales[id].respuesta = true;
            if (this.ActividadesGenerales[id]["UrlArchivo"] === undefined) {
              this.ActividadesGenerales[id]["UrlArchivo"] = RutaArchivo;
            }
            else{
              this.ActividadesGenerales[id].UrlArchivo = RutaArchivo;
            }
            
            this.ActividadesGenerales[id].adjunto = true;
            this.ActividadesGenerales[id].adjuntoOk = true;
            let respuesta = JSON.stringify(this.ActividadesGenerales);
            ObjGuardar = {
              Json: respuesta
            }
          }
          else if (actividadRespuesta.TipoActividad === "Extra") {
            let id = this.ActividadesExtras.findIndex(x => x.id === actividadRespuesta.id);
            ObjAdjunto = this.ActividadesExtras[id].adjunto;
            RutaArchivo = await this.AgregarAdjuntoActividad(ObjAdjunto, actividadRespuesta.id);
            this.ActividadesExtras[id].respuesta = true;
            if (this.ActividadesExtras[id]["UrlArchivo"] === undefined) {
              this.ActividadesExtras[id]["UrlArchivo"] = RutaArchivo;
            }
            else{
              this.ActividadesExtras[id].UrlArchivo = RutaArchivo;
            }
            this.ActividadesExtras[id].adjunto = true;
            this.ActividadesExtras[id].adjuntoOk = true;
            let respuesta = JSON.stringify(this.ActividadesExtras);
            ObjGuardar = {
              JsonExtraordinario: respuesta
            }
          }                   
          this.servicio.actualizarActividad(this.listaRespuestas, this.IdRegistroActividad, ObjGuardar).then(
            (respuesta) => {
              this.actividadRespuestaActualizar.adjunto = null;
              this.actividadesGestionadas++;
              this.loading = false;
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

  mostrarConfirmacionBorrarAdjuntos(switcheActividad, actividadRespuesta, template: TemplateRef<any>): any {
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

 async AgregarAdjuntoActividad(actividadRespuestaActualizar, id): Promise<any> {
    let nombreArchivo = id + "-AG-" + this.generarllaveSoporte() + "-" + actividadRespuestaActualizar.name;
    let ObjRespuesta = "";
    await this.servicio.agregarAdjuntoActividad(this.bibliotecaRespuestas, nombreArchivo, actividadRespuestaActualizar).then(
      (respuesta) => { 
        ObjRespuesta = respuesta.data.ServerRelativeUrl;
      }
    ).catch(
      (error) => {
        console.log(error);
        this.loading = false;
        alert('Ha ocurrido un error al actualizar la actividad');
      }
    );

    return ObjRespuesta;
  } 

  ActualizarPropiedadesAdjunto(bibliotecaRespuestas: string, ObjDoc: any, id: any, IdRegistroActividad: number): any {
    this.servicio.actualizarPropiedadesAdjuntoActividad(bibliotecaRespuestas,ObjDoc,id,IdRegistroActividad).then(
      (resultado)=>{
        this.actividadesGestionadas++;
        this.loading = false;
      }
    );
  }

  private AsignarFormatoFecha(FechaActividad: Date) {
    var d = FechaActividad,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
    // return fechaRetornar;
  }

  async modificarMeta(nombreArchivo): Promise<any> {
    let respuesta = [];
    // let fechahoy = this.ObtenerFormatoFecha(new Date());
    let fechahoy = this.AsignarFormatoFecha(new Date()); 
    await this.servicio.ObtenerArchivoAdjunto(this.bibliotecaRespuestas, nombreArchivo, fechahoy).then(
      (res)=>{
        respuesta = res;
      }
    ).catch(
      (error)=> {
        console.log(error);
        this.loading = false;
        alert('Ha ocurrido un error al actualizar la actividad');
      }
    ); 

    return respuesta;
  }

  generarllaveSoporte(): string {
    var fecha = new Date();
    var valorprimitivo = fecha.valueOf().toString();
    return valorprimitivo;
  }

  subirAdjuntoActividad(fileInput: any, actividad: Actividades) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      actividad.adjunto = fileInput.target.files[0];
      this.fileuploadActual = fileInput.srcElement.value;
    }
    else {
      actividad.adjunto = null;
    }
  }

  confirmar(): void {
    let IdAdjuntoBorrar: number;
    let ObjGuardar;
    if (this.actividadRespuestaActualizar.TipoActividad === "General") {
      let index = this.ActividadesGenerales.findIndex(x => x.id === this.actividadRespuestaActualizar.id)
      this.ActividadesGenerales[index].respuesta = false;
      this.ActividadesGenerales[index].aprobacionActividad = "";
      this.ActividadesGenerales[index].adjunto = false;
      this.ActividadesGenerales[index].adjuntoOk = false;      
      if (this.ActividadesGenerales[index]["UrlArchivo"] !== undefined) {
        this.ActividadesGenerales[index].UrlArchivo = "";
      }
      let respuesta = JSON.stringify(this.ActividadesGenerales);
      ObjGuardar = {
        Json: respuesta
      }
    }
    else if (this.actividadRespuestaActualizar.TipoActividad === "Extra") {
      let index = this.ActividadesExtras.findIndex(x => x.id === this.actividadRespuestaActualizar.id)
      this.ActividadesExtras[index].respuesta = false;
      this.ActividadesExtras[index].aprobacionActividad = "";
      this.ActividadesExtras[index].adjunto = false;
      this.ActividadesExtras[index].adjuntoOk = false;
      if (this.ActividadesExtras[index]["UrlArchivo"] !== undefined) {
        this.ActividadesExtras[index]["UrlArchivo"] = "";
      }
      let respuesta = JSON.stringify(this.ActividadesExtras);
      ObjGuardar = {
        JsonExtraordinario: respuesta
      }
    }
    this.servicio.actualizarActividad(this.listaRespuestas, this.IdRegistroActividad, ObjGuardar).then(
      (respuesta)=>{
        this.actividadesGestionadas--;
        this.modalRef.hide();
        this.switcheActividadSeleccionada.checked = false;
        // this.borrarAdjuntosActividad(IdAdjuntoBorrar);
      },
      (error)=>{
        console.log(error);
        alert('Ha ocurrido un error al actualizar la actividad');
      }
    );
    // this.servicio.obtenerAdjuntos(this.bibliotecaRespuestas, this.IdRegistroActividad, this.actividadRespuestaActualizar).then(
    //   (respuesta) => {
    //     IdAdjuntoBorrar = respuesta[0].Id;
    //     // this.actividadRespuestaActualizar.respuesta = false;
    //     // this.actividadRespuestaActualizar.aprobacionActividad = "";
    //     let ObjGuardar;
    //     if (this.actividadRespuestaActualizar.TipoActividad === "General") {
    //       let index = this.ActividadesGenerales.findIndex(x => x.id === this.actividadRespuestaActualizar.id)
    //       this.ActividadesGenerales[index].respuesta = false;
    //       this.ActividadesGenerales[index].aprobacionActividad = "";
    //       this.ActividadesGenerales[index].adjunto = false;
    //       this.ActividadesGenerales[index].adjuntoOk = false;
    //       let respuesta = JSON.stringify(this.ActividadesGenerales);
    //       ObjGuardar = {
    //         Json: respuesta
    //       }
    //     }
    //     else if (this.actividadRespuestaActualizar.TipoActividad === "Extra") {
    //       let index = this.ActividadesExtras.findIndex(x => x.id === this.actividadRespuestaActualizar.id)
    //       this.ActividadesExtras[index].respuesta = false;
    //       this.ActividadesExtras[index].aprobacionActividad = "";
    //       this.ActividadesExtras[index].adjunto = false;
    //       this.ActividadesExtras[index].adjuntoOk = false;
    //       let respuesta = JSON.stringify(this.ActividadesExtras);
    //       ObjGuardar = {
    //         JsonExtraordinario: respuesta
    //       }
    //     }

    //     this.servicio.actualizarActividad(this.listaRespuestas, this.IdRegistroActividad, ObjGuardar).then(
    //       (respuesta)=>{
    //         this.borrarAdjuntosActividad(IdAdjuntoBorrar);
    //       },
    //       (error)=>{
    //         console.log(error);
    //         alert('Ha ocurrido un error al actualizar la actividad');
    //       }
    //     );
        // this.ActualizarActividadyBorrarAdjuntos(this.ActividadesGenerales, respuesta);
      
    
  }

  // ActualizarActividadyBorrarAdjuntos(actividadRespuesta: Respuesta, adjuntoBorrar): any {
  //   this.servicio.actualizarActividad(this.listaRespuestas, actividadRespuesta, this.IdRegistroActividad).then(
  //     (respuesta) => {
  //       this.borrarAdjuntosActividad(adjuntoBorrar[0].Id);
  //     }, error => {
  //       console.log(error);
  //       alert('Ha ocurrido un error al actualizar la actividad');
  //     }
  //   );
  // }

  borrarAdjuntosActividad(adjuntoBorrar): any {
    this.servicio.borrarAdjunto(this.bibliotecaRespuestas,adjuntoBorrar).then(
      (respuesta) => {
        this.actividadesGestionadas--;
        this.modalRef.hide();
        this.switcheActividadSeleccionada.checked = false;
        // this.LimpiarControlAdjunto(actividadRespuesta.id);
      }, error => {
        console.log(error);
      }
    );
  }

  LimpiarControlAdjunto(idControlAdjunto) {
    (<HTMLInputElement>document.getElementById("adjunto-" + idControlAdjunto)).value = null;
  }

  declinar(): void {
    this.switcheActividadSeleccionada.checked = true;
    this.modalRef.hide();
  }
}
