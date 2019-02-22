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

  async ngOnInit() {
    this.abrirCerrarMenu();
    await this.ObtenerUsuarioActual();
    await this.ObtenerRolUsuario();
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

  async ObtenerUsuarioActual() {
    const response = await this.servicio.obtenerUsuarioActualPromesa();
    this.nombreUsuario = response.Title;
    this.usuarioActual = new Usuario(response.Id, response.Title, "");
    this.ObtenerImagenUsuario();
  }

  ObtenerImagenUsuario(): any {
    this.imagenUsuario = environment.urlWeb + "/_layouts/15/userphoto.aspx?size=k&username=" + this.usuarioActual.nombre;
  }

  async ObtenerRolUsuario() {
    const response = await this.servicio.obtenerRolUsuarioActualPromesa(this.usuarioActual.id);
    this.usuarioActual.rol = response[0].Responsable.Title;
    this.responsableUsuario = response[0].Responsable.Title;
    sessionStorage.setItem('usuario', JSON.stringify(this.usuarioActual));
    this.pintarMenuSegunRol();
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
