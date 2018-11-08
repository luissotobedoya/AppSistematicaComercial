import { Component, TemplateRef, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp.servicio';
import { Clasificacion } from '../dominio/clasificacion';
import { Usuario } from '../dominio/usuario';
import * as $ from 'jquery';
import { Responsable } from '../dominio/responsable';
import { Proceso } from '../dominio/proceso';
import { Actividad } from '../dominio/actividad';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-mis-actividades',
  templateUrl: './mis-actividades.component.html',
  styleUrls: ['./mis-actividades.component.css'],
})
export class MisActividadesComponent implements OnInit {

  tituloPagina = "Mis actividades";
  usuarioActual: Usuario;
  responsable: any;
  clasificaciones: Clasificacion[] = [];
  procesos: Proceso[] = [];
  actividades: Actividad[] = [];
  clasificacionId: number;
  responsableId: number;
  procesoId: number;
  mostrarProcesos = false;
  mostrarActividades = false;
  mensajeModal: string;
  tituloModal: string;
  public modalRef: BsModalRef;
  mostrarMensajeNoHayProcesos = false;

  constructor(private servicio: SPServicio, private modalService: BsModalService) {

  }

  ngOnInit() {
    this.RecuperarUsuario();
    this.RecuperarResponsable();
    this.ObtenerClasificacionesSistema();
  }

  RecuperarUsuario() {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
  }

  RecuperarResponsable() {
    this.responsable = JSON.parse(sessionStorage.getItem('responsable'));
  }

  ObtenerClasificacionesSistema() {
    this.servicio.ObtenerClasificaciones().subscribe(
      (Response) => {
        this.clasificaciones = Clasificacion.fromJsonList(Response);
      },
      error => {
        console.log('Error obteniendo las clasificaciones: ' + error);
      }
    );
  }

  OcultarBotonClasificacionJefeZona() {
    $(document).ready(function () {
      $('[name="Gestión de Zona"]').hide();
    });
  }

  ObtenerProcesosPorClasificacion(clasificacion, template: TemplateRef<any>) {
    this.clasificacionId = clasificacion.id;
    this.responsable = JSON.parse(sessionStorage.getItem('responsable'));
    if (this.responsable == null) {
      this.tituloModal = "No hay responsable";
      this.mensajeModal = "Debe haber un responsable seleccionado.";
      this.modalRef = this.modalService.show(template);
    } else {
      this.responsableId = this.responsable[0].id;
      
      this.procesos = [];
      this.actividades = [];
      this.servicio.ObtenerProcesos(this.responsableId, this.clasificacionId).subscribe(
        (Response) => {
          this.mostrarProcesos = true;
          this.mostrarActividades = false;
          if (Response.length == 0) {
            this.mostrarMensajeNoHayProcesos = true;
          } else {
            this.mostrarMensajeNoHayProcesos = false;
            Response.forEach(proceso => {
              this.procesos.push(new Proceso(proceso.Proceso.ID, proceso.Proceso.Title));
            });
            sessionStorage.setItem('procesos',JSON.stringify(this.procesos));
            this.procesos = this.ExtraerProcesosUnicos(this.procesos);
          }
        },
        error => {
          console.log('Error obteniendo los procesos: ' + error);
        }
      );
    }
  }

  ExtraerProcesosUnicos(procesos: Proceso[]): Proceso[] {
    return procesos = procesos.filter((proceso, index, self) =>
      index === self.findIndex((p) => (
        p.id === proceso.id && p.nombre === proceso.nombre
      ))
    )
  }

  obtenerActividades(proceso) {
    this.actividades = [];
    this.procesoId = proceso.id;
    this.servicio.ObtenerActividades(this.responsableId, this.clasificacionId, this.procesoId).subscribe(
      (Response) => {
        this.mostrarActividades = true,
          this.actividades = Actividad.fromJsonList(Response);
          sessionStorage.setItem('actividades',JSON.stringify(this.actividades));
      },
      error => {
        console.log('Error obteniendo las actividades: ' + error);
      }
    );
  }
}
