import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';


import { AppComponent } from './app.component';
import { MisActividadesComponent } from './mis-actividades/mis-actividades.component';
import { InformesComponent } from './informes/informes.component';
import { NovedadesComponent } from './novedades/novedades.component';
import { DocumentacionComponent } from './documentacion/documentacion.component';
import { AsignacionTareasComponent } from './asignacion-tareas/asignacion-tareas.component';
import { SolicitudesTiendaComponent } from './solicitudes-tienda/solicitudes-tienda.component';
import { ParametrizacionComponent } from './parametrizacion/parametrizacion.component';
import { SPServicio } from './servicios/sp.servicio';

@NgModule({
  declarations: [
    AppComponent,
    MisActividadesComponent,
    InformesComponent,
    NovedadesComponent,
    DocumentacionComponent,
    AsignacionTareasComponent,
    SolicitudesTiendaComponent,
    ParametrizacionComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AlertModule.forRoot(),
    ReactiveFormsModule,
    ModalModule.forRoot(), 
    RouterModule.forRoot([
      {path:'',redirectTo:'/mis-actividades',pathMatch:'full'},
      {path:'mis-actividades', component:MisActividadesComponent},
      {path:'informes',component:InformesComponent},
      {path:'novedades', component:NovedadesComponent},
      {path:'documentacion', component:DocumentacionComponent},
      {path:'asignacion-tareas', component:AsignacionTareasComponent},
      {path:'solicitudes-tienda', component:SolicitudesTiendaComponent},
      {path:'parametrizacion', component:ParametrizacionComponent}
    ]),
    HttpModule,
  ],
  providers: [SPServicio],
  bootstrap: [AppComponent]
})
export class AppModule { }
