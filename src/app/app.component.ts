import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { Usuario } from '../app/dominio/usuario';
import { SPServicio } from '../app/servicios/sp.servicio';
import { Actividad } from './dominio/actividad';
import { Proceso } from './dominio/proceso';
import { Responsable } from './dominio/responsable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private servicio: SPServicio, private router: Router) { }

  title = 'Sistemática Comercial';
  nombreUsuario;
  roles: string[] = [];
  usuarioActual: Usuario;
  procesos: Proceso[] = [];
  actividades: Actividad[] = [];
  responsables: Responsable[] = [];
  responsable: Responsable;

  radioRol: any;
  radioSelected: string;
  radioSelectedString: string;

  public ngOnInit() {
    $(document).ready(function () {
      $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
      });
    });
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.nombreUsuario = Response.Title;
        this.usuarioActual = new Usuario(Response.Id, Response.Title, this.roles);
        this.ObtenerRolesUsuario(this.usuarioActual);
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  ObtenerRolesUsuario(usuario: Usuario) {

    this.servicio.ObtenerGruposUsuario(usuario.id).subscribe(
      (Response) => {
        if (Response != null) {
          Response.forEach(element => {
            if (element.Title == "GrupoAdministradoresTienda") {
              this.roles.push("Administrador de tienda");
            }
            if (element.Title == "GrupoJefesZona") {
              this.roles.push("Jefe de zonas");
            }
            if (element.Title == "GrupoAdministradoresSC") {
              this.roles.push("Administrador Sistemática Comercial");
            }
          });

          this.usuarioActual.roles = this.roles;
          if (this.usuarioActual.roles.length > 0) {
            if (this.usuarioActual.roles.length == 1) {
              let rol = this.usuarioActual.roles[0];
              this.SeleccionarResponsable(rol);
              this.accionRol(rol);
            }
            else {
              this.responsable = JSON.parse(sessionStorage.getItem('responsable'));
              if (this.responsable != null) {
                let rol = this.responsable[0].titulo;
                this.SeleccionarResponsable(rol);
                if (rol == "Administrador de tienda") {
                  this.OcultarBotonClasificacionJefeZona();
                } else {
                  this.MostrarBotonClasificacionJefeZona();
                }
              }
            }
          } else {
            console.log("El usuario no posee roles disponibles en la aplicación");
          }
        }
      }, err => {
        console.log('Error obteniendo grupos por usuario: ' + err);
      }
    )
  }

  SeleccionarResponsable(rol: string) {
    this.radioRol = this.roles.find(Item => Item === rol);
    this.radioSelectedString = JSON.stringify(this.radioRol);
  }

  accionRol(objeto) {
    let rol = objeto;
    if (rol == "Administrador de tienda") {
      this.OcultarBotonClasificacionJefeZona();
    } else {
      this.MostrarBotonClasificacionJefeZona();
    }
    this.ObtenerIdResponsable(rol);
  }

  OcultarBotonClasificacionJefeZona() {
    $(document).ready(function () {
      $('[ng-reflect-name="Gestión de Zona"]').hide();
    });
  }

  MostrarBotonClasificacionJefeZona() {
    $(document).ready(function () {
      $('[ng-reflect-name="Gestión de Zona"]').show();
    });
  }

  ObtenerIdResponsable(rol: string) {
    this.servicio.ObtenerResponsablePorRol(rol).subscribe(
      (Response) => {
        this.responsables = Responsable.fromJsonList(Response);
        sessionStorage.setItem('usuario', JSON.stringify(this.usuarioActual));
        sessionStorage.setItem('responsable', JSON.stringify(this.responsables));
        this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
        this.responsables = JSON.parse(sessionStorage.getItem('responsable'));
      }, err => {
        console.log('Error obteniendo responsables: ' + err);
      }
    )
  }
}
