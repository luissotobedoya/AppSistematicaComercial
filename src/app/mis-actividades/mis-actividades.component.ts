import { Component, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp.servicio';
import { Clasificacion } from '../dominio/clasificacion';

@Component({
  selector: 'app-mis-actividades',
  templateUrl: './mis-actividades.component.html',
  styleUrls: ['./mis-actividades.component.css'],
})
export class MisActividadesComponent implements OnInit {
  
  tituloPagina = "Mis actividades";
  clasificaciones: Clasificacion[] = [];
  
  constructor(private servicio: SPServicio) {
    
   }

  ngOnInit() {
    this.ObtenerClasificacionesSistema();
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

  ObtenerProcesosPorClasificacion(evento){
    let idClasificacion = evento.target.id.split("-")[1];
    console.log(idClasificacion);
  }


}
