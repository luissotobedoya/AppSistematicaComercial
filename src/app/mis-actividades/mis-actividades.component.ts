import { Component, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp.servicio';
import { Clasificacion } from '../dominio/clasificacion';

@Component({
  selector: 'app-mis-actividades',
  templateUrl: './mis-actividades.component.html',
  styleUrls: ['./mis-actividades.component.css']
})
export class MisActividadesComponent implements OnInit {
  
  clasificaciones: Clasificacion[] = [];
  constructor(private servicio: SPServicio) { }

  ngOnInit() {
    this.ObtenerClasificacionesSistema();
  }

  ObtenerClasificacionesSistema() {
    this.servicio.ObtenerClasificaciones().subscribe(
      (Response) => {
        this.clasificaciones = Clasificacion.fromJsonList(Response);
        console.log(this.clasificaciones);
      },
      error => {
        console.log('err: ' + error);
      }
    );
  }

}
