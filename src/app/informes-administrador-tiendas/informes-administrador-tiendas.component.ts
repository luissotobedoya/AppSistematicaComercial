import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../dominio/usuario';

@Component({
  selector: 'app-informes-administrador-tiendas',
  templateUrl: './informes-administrador-tiendas.component.html',
  styleUrls: ['./informes-administrador-tiendas.component.css']
})
export class InformesAdministradorTiendasComponent implements OnInit {
  usuarioActual: Usuario;
  constructor(private router: Router) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.ValidarPerfilacion();
  }

  ngOnInit() {
  }

  private ValidarPerfilacion() {
    if (this.usuarioActual != null) {
      if (this.usuarioActual.rol != null) {
        switch (this.usuarioActual.rol.toLowerCase()) {
          case "administrador de tienda":
            this.router.navigate(['/acceso-denegado']);
            break;
          case "jefe de zona":
            console.log("perfilación correcta");
            break;
          case "administrador sistemática comercial":
            this.router.navigate(['/acceso-denegado']);
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

}
