import { Component, OnInit } from '@angular/core';
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
  title = 'Sistemática Comercial';
  nombreUsuario: string;
  responsableUsuario: string;
  imagenUsuario: string;
  usuarioActual: Usuario;
  //Perfilacion
  VerMisActividades: boolean;
  VerActividadesExtras: boolean;
  VerInformes: boolean;
  VerInformesTiendas: boolean;
  VerNovedades: boolean;
  VerDocumentacion: boolean;
  VerRevisarNovedades: boolean;
  VerParametrizacion: boolean;

  constructor(private servicio: SPServicio) {
    this.VerMisActividades = false;
    this.VerActividadesExtras = false;
    this.VerInformes = false;
    this.VerInformesTiendas = false;
    this.VerNovedades = false;
    this.VerDocumentacion = false;
    this.VerRevisarNovedades = false;
    this.VerParametrizacion = false;
  }

  public ngOnInit() {
    this.abrirCerrarMenu();
    this.ObtenerUsuarioActual();
  }

  destruirSessiones(): any {
    sessionStorage.removeItem("usuario");
  }

  abrirCerrarMenu() {
    $(document).ready(function () {
      $("#menu-toggle").click(function (e) {
        let textoMenu = e.target.innerText;
        let nuevoTextoMenu = "";
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        if (textoMenu == "Ocultar menú") {
          nuevoTextoMenu = "Mostrar menú";
          e.target.innerText = nuevoTextoMenu;
        } else {
          nuevoTextoMenu = "Ocultar menú";
          e.target.innerText = nuevoTextoMenu;
        }
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
      }, errorServicio => {
        console.log('Error obteniendo usuario: ' + errorServicio);
      }
    )
  }

  ObtenerImagenUsuario(): any {
    this.imagenUsuario = environment.urlWeb + "/_layouts/15/userphoto.aspx?size=k&username=" + this.usuarioActual.nombre;
  }

  ObtenerRolUsuario() {
    this.servicio.ObtenerRolUsuarioActual(this.usuarioActual.id).subscribe(
      (Response) => {
        this.usuarioActual.rol = Response[0].Responsable.Title;
        this.responsableUsuario = Response[0].Responsable.Title;
        sessionStorage.setItem('usuario', JSON.stringify(this.usuarioActual));
        this.pintarMenuSegunRol();
      }, err => {
        console.log('Error obteniendo rol de usuario: ' + err);
      }
    )
  }

  pintarMenuSegunRol(): any {
    switch (this.responsableUsuario.toLowerCase()) {
      case "administrador de tienda":
        this.VerMisActividades = true;
        this.VerDocumentacion = true;
        break;
      case "jefe de zonas":
        this.VerMisActividades = true;
        this.VerActividadesExtras = true;
        this.VerInformesTiendas = true;
        this.VerNovedades = true;
        this.VerRevisarNovedades = true;
        this.VerDocumentacion = true;
        break;
      case "administrador sistemática comercial":
        this.VerMisActividades = true;
        this.VerInformes = true;
        this.VerDocumentacion = true;
        this.VerParametrizacion = true;
        break;
    }
  }
}
