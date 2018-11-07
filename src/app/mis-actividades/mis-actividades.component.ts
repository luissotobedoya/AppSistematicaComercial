import { Component, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp.servicio';
import { Clasificacion } from '../dominio/clasificacion';
import { Usuario } from '../dominio/usuario';
import * as $ from 'jquery';
import { Responsable } from '../dominio/responsable';
import { Proceso } from '../dominio/proceso';
import { Actividad } from '../dominio/actividad';


@Component({
  selector: 'app-mis-actividades',
  templateUrl: './mis-actividades.component.html',
  styleUrls: ['./mis-actividades.component.css'],
})
export class MisActividadesComponent implements OnInit {

  tituloPagina = "Mis actividades";
  usuarioActual: Usuario;
  responsable: Responsable;
  clasificaciones: Clasificacion[] = [];
  procesos: Proceso[] = [];
  actividades: Actividad[] = [];
  clasificacionId: number;
  responsableId: number;
  procesoId:number;
  mostrarProcesos = false;
  mostrarActividades = false;
  constructor(private servicio: SPServicio) {

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

  ValidarRolesPorUsuario() {

    let rolJefeZona = this.usuarioActual.roles.indexOf("Jefe de zonas");
    let rolAdministradorTienda = this.usuarioActual.roles.indexOf("Administrador de tienda");
    let rolAdministradorSC = this.usuarioActual.roles.indexOf("Administrador Sistemática comercial");

    if (rolAdministradorTienda < 0 && rolJefeZona < 0 && rolAdministradorSC < 0) {
      console.log("No posee roles");
    }
    if (rolAdministradorTienda >= 0 && rolJefeZona < 0 && rolAdministradorSC < 0) {
      this.OcultarBotonClasificacionJefeZona();
    }
  }

  OcultarBotonClasificacionJefeZona() {
    $(document).ready(function () {
      $('[name="Gestión de Zona"]').hide();
    });
  }

  ObtenerProcesosPorClasificacion(clasificacion) {
    this.clasificacionId = clasificacion.id;
    this.responsableId = this.responsable[0].id
    this.procesos = [];
    this.actividades = [];
    this.servicio.ObtenerProcesos(this.responsableId, this.clasificacionId).subscribe(
      (Response) => {
        this.mostrarProcesos = true;
        Response.forEach(proceso => {
          this.procesos.push(new Proceso(proceso.Proceso.ID, proceso.Proceso.Title));
        });
        this.procesos = this.ExtraerProcesosUnicos(this.procesos);
      },
      error => {
        console.log('Error obteniendo los procesos: ' + error);
      }
    );
  }

  ExtraerProcesosUnicos(procesos: Proceso[]): Proceso[] {
    return procesos = procesos.filter((proceso, index, self) =>
      index === self.findIndex((p) => (
        p.id === proceso.id && p.nombre === proceso.nombre
      ))
    )
  }

  obtenerActividades(proceso){
    this.actividades = [];
    this.procesoId = proceso.id;
    this.servicio.ObtenerActividades(this.responsableId, this.clasificacionId, this.procesoId).subscribe(
      (Response) => {
        this.mostrarActividades = true,
        this.actividades = Actividad.fromJsonList(Response);
      },
      error => {
        console.log('Error obteniendo las actividades: ' + error);
      }
    );
  }



}
