import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { SPServicio } from '../app/servicios/sp.servicio';
import { Usuario } from '../app/dominio/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private servicio: SPServicio) {

  }

  title = 'Sistemática Comercial';
  nombreUsuario;
  roles: string[]=[];
  usuarioActual : Usuario;
  

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

  ObtenerRolesUsuario(usuario: Usuario){
    this.servicio.ObtenerGruposUsuario(usuario.id).subscribe(
      (Response) => {
        if(Response != null){
          Response.forEach(element => {
            if(element.Title == "GrupoAdministradoresTiendas"){
                this.roles.push("Administrador de tienda");
            }
            if(element.Title == "GrupoJefesZona"){
              this.roles.push("Jefe de zona");
            }
            if(element.Title == "GrupoAdministradoresSC"){
              this.roles.push("Administrador Sistemática comercial");
            }
          });
          this.usuarioActual.roles = this.roles;
        }
      }, err => {
        console.log('Error obteniendo grupos por usuario');
      }
    )
  }

}
