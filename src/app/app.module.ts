import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';

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
    BrowserModule,    RouterModule.forRoot([
      {path:'',redirectTo:'/mis-actividades',pathMatch:'full'},
      {path:'mis-actividades', component:MisActividadesComponent},
      {path:'informes',component:InformesComponent},
      {path:'novedades', component:NovedadesComponent},
      {path:'documentacion', component:DocumentacionComponent},
      {path:'asignacion-tareas', component:AsignacionTareasComponent},
      {path:'solicitudes-tienda', component:SolicitudesTiendaComponent},
      {path:'parametrizacion', component:ParametrizacionComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
