import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MisActividadesComponent } from './mis-actividades/mis-actividades.component';
import { InformesComponent } from './informes/informes.component';
import { NovedadesComponent } from './novedades/novedades.component';
import { DocumentacionComponent } from './documentacion/documentacion.component';
import { AsignacionTareasComponent } from './asignacion-tareas/asignacion-tareas.component';
import { SolicitudesTiendaComponent } from './solicitudes-tienda/solicitudes-tienda.component';
import { ParametrizacionComponent } from './parametrizacion/parametrizacion.component';

@NgModule({
  declarations: [
    AppComponent,
    MisActividadesComponent,
    InformesComponent,
    NovedadesComponent,
    DocumentacionComponent,
    AsignacionTareasComponent,
    SolicitudesTiendaComponent,
    ParametrizacionComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
