import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../dominio/usuario';

@Component({
  selector: 'app-parametrizacion',
  templateUrl: './parametrizacion.component.html',
  styleUrls: ['./parametrizacion.component.css']
})
export class ParametrizacionComponent implements OnInit {
  tituloPagina = "Parametrización";
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
          case "jefe de zonas":
            this.router.navigate(['/acceso-denegado']);
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

}
