import { Component, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp.servicio';
import { Respuesta } from '../dominio/respuesta';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.css']
})
export class DocumentacionComponent implements OnInit {
  tituloPagina = "Documentación";
  listaRespuestas: string;
  respuestasActividades: Respuesta[] = []

  constructor(private servicio: SPServicio) { 
    this.listaRespuestas = this.ObtenerNombreListaActual();
  }

  ngOnInit() {
    this.obtenerTiposValidacion();
  }

  obtenerActividadesConAdjunto(){
    let FechaActual = new Date();
    this.servicio.obtenerActividadesConAdjuntoDeTiendaPorFecha(this.listaRespuestas,FechaActual,9).subscribe(
      (Response) => {
        this.respuestasActividades =  Respuesta.fromJsonList(Response);
        console.log(this.respuestasActividades);
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  ObtenerNombreListaActual(): string {
    const nombrelista = 'RespuestasActividades';
    let añoActual = new Date().getFullYear();
    let mesActual = ("0" + (new Date().getMonth() + 1)).slice(-2);
    let listaRespuestas = nombrelista + añoActual + mesActual;
    return listaRespuestas;
  }

  obtenerTiposValidacion(){
    this.servicio.obtenerTiposValidacion().then(
      (Response) => {
        console.log(Response);
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

}

