import { Component, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp.servicio';
import { Clasificacion } from '../dominio/clasificacion';
import { Usuario } from '../dominio/usuario';
import * as $ from 'jquery';
import { Responsable } from '../dominio/responsable';
import { Proceso } from '../dominio/proceso';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-mis-actividades',
  templateUrl: './mis-actividades.component.html',
  styleUrls: ['./mis-actividades.component.css'],
})
export class MisActividadesComponent implements OnInit {
  
  tituloPagina = "Mis actividades";
  clasificaciones: Clasificacion[] = [];
  usuarioActual: Usuario;
  responsable: Responsable;
  procesos: Proceso[] = [];
  
  constructor(private servicio: SPServicio) {
    
   }

  ngOnInit() {

    this.RecuperarUsuario();
    this.RecuperarResponsable();
    this.ObtenerClasificacionesSistema();

  }

  RecuperarUsuario(){
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    console.log(this.usuarioActual);
  }

  RecuperarResponsable(){
    this.responsable = JSON.parse(sessionStorage.getItem('responsable'));
    console.log(this.responsable);
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

  ValidarRolesPorUsuario(){

    let rolJefeZona = this.usuarioActual.roles.indexOf("Jefe de zonas");
    let rolAdministradorTienda = this.usuarioActual.roles.indexOf("Administrador de tienda");
    let rolAdministradorSC = this.usuarioActual.roles.indexOf("Administrador Sistemática comercial");

    if(rolAdministradorTienda < 0 && rolJefeZona < 0 && rolAdministradorSC < 0){
      console.log("No posee roles");
    }
    if(rolAdministradorTienda >= 0 && rolJefeZona < 0 && rolAdministradorSC < 0){
      this.OcultarBotonClasificacionJefeZona();
    }
  }

  OcultarBotonClasificacionJefeZona(){
    $(document).ready(function () {
      $('[name="Gestión de Zona"]').hide();
    });
  }

  ObtenerProcesosPorClasificacion(evento){
    let idClasificacion = evento.target.id.split("-")[1];
    this.servicio.ObtenerProcesos(this.responsable[0].id, idClasificacion).subscribe(
      (Response) => {
        console.log(Response);
        Response.forEach(proceso => {
          this.procesos.push(proceso.Proceso.ID, proceso.Proceso.Title);
        });
        
       this.procesos = this.ExtraerProcesosUnicos(this.procesos);
       console.log(this.procesos);

      },
      error => {
        console.log('Error obteniendo los procesos: ' + error);
      }
    );
  }

  ExtraerProcesosUnicos(procesos: Proceso[]): Proceso[] {
      let distinctProcesos: Proceso[] = [];
      procesos.forEach(element => {
        if(!distinctProcesos.includes(element)){
          distinctProcesos.push(element);
        }
      });
      return distinctProcesos;
  }
}
