import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { Usuario } from '../app/dominio/usuario';
import { SPServicio } from '../app/servicios/sp.servicio';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private servicio: SPServicio, private router: Router) { }

  title = 'Sistemática Comercial';
  nombreUsuario : string;
  responsableUsuario: string;
  imagenUsuario: string;
  usuarioActual: Usuario;

  public ngOnInit() {
    this.abrirCerrarMenu();
    this.ObtenerUsuarioActual();
  }

  abrirCerrarMenu(){
    $(document).ready(function () {
      $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
      });
    });
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.nombreUsuario = Response.Title;
        this.usuarioActual = new Usuario(Response.Id, Response.Title, "");
        this.ObtenerImagenUsuario();
        this.ObtenerRolUsuario();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  ObtenerImagenUsuario(): any {
    this.imagenUsuario = environment.urlWeb + "/_layouts/15/userphoto.aspx?size=k&username=" + this.usuarioActual.nombre;
  }

  ObtenerRolUsuario(){
    this.servicio.ObtenerRolUsuarioActual(this.usuarioActual.id).subscribe(
      (Response) => {
        this.usuarioActual.rol = Response[0].Responsable.Title;
        this.responsableUsuario = Response[0].Responsable.Title;
      }, err => {
        console.log('Error obteniendo rol de usuario: ' + err);
      }
    )
  }
}
