import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http'
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule, TooltipModule,ProgressbarModule, PaginationModule } from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DataTablesModule } from 'angular-datatables';
import { NumberDirective } from './directivas/numbers-only.directive';
import { AppComponent } from './app.component';
import { MisActividadesComponent } from './mis-actividades/mis-actividades.component';
import { InformesComponent } from './informes/informes.component';
import { NovedadesComponent } from './novedades/novedades.component';
import { DocumentacionComponent } from './documentacion/documentacion.component';
import { AsignacionTareasComponent } from './asignacion-tareas/asignacion-tareas.component';
import { SolicitudesTiendaComponent } from './solicitudes-tienda/solicitudes-tienda.component';
import { ParametrizacionComponent } from './parametrizacion/parametrizacion.component';
import { SPServicio } from './servicios/sp.servicio';
import { ActividadesExtrasComponent } from './actividades-extras/actividades-extras.component';
import { ExcelService } from './servicios/excel.service';

defineLocale('engb', enGbLocale);

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
    ActividadesExtrasComponent,
    NumberDirective    
  ],
  imports: [
    BrowserModule,       
    FormsModule,    
    BrowserAnimationsModule,
    HttpClientModule,
    AlertModule.forRoot(),
    ProgressbarModule.forRoot(),
    ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),    
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    DataTablesModule,
    RouterModule.forRoot([
      {path:'',redirectTo:'/mis-actividades',pathMatch:'full'},
      {path:'mis-actividades', component:MisActividadesComponent},
      {path:'informes',component:InformesComponent},
      {path:'novedades', component:NovedadesComponent},
      {path:'documentacion', component:DocumentacionComponent},
      {path:'asignacion-tareas', component:AsignacionTareasComponent},
      {path:'solicitudes-tienda', component:SolicitudesTiendaComponent},
      {path:'parametrizacion', component:ParametrizacionComponent},
      {path:'actividades-extras', component:ActividadesExtrasComponent}
    ]),
    HttpModule
  ],
  providers: [SPServicio, ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
