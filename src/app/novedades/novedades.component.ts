import { Component, OnInit, TemplateRef } from '@angular/core';
import { SPServicio } from '../servicios/sp.servicio';
import { Novedad } from '../dominio/novedad';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TiendaXJefe } from '../dominio/TiendaXJefe';
import { ItemAddResult, Field } from 'sp-pnp-js';
import { BsModalService, BsLocaleService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Usuario } from '../dominio/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {
  tituloPagina = "Novedades";
  NovedadForm: FormGroup;
  submitted = false;
  ObjTiendas: any[];
  ObjTipoSolicitud: any[];
  loading = false;
  NovedadGuardar: Novedad;
  tituloModal: any;
  mensajeModal: any;
  public modalRef: BsModalRef;
  timer: any;
  usuarioActual: Usuario;
  IdResponsableSolicitud: any;
  ArchivoAdjunto: File = null;

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private servicioModal: BsModalService, private _localeService: BsLocaleService, private router: Router) {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.ValidarPerfilacion();
    this.NovedadGuardar = new Novedad(null, null, null, "", null);
    this._localeService.use('engb');
  }

  private ValidarPerfilacion() {
    if (this.usuarioActual != null) {
      if (this.usuarioActual.rol != null) {
        switch (this.usuarioActual.rol.toLowerCase()) {
          case "administrador de tienda":
            this.router.navigate(['/acceso-denegado']);
            break;
          case "jefe de zonas":
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

  ngOnInit() {
    this.loading = true;
    this.NovedadForm = this.formBuilder.group({
      //txtTienda: ["", Validators.required],
      txtFecha: ["", Validators.required],
      txtTipoSolicitud: [Validators.required],
      txtCantidad: ["", Validators.required],
      txtDescripcion: ["", Validators.required]
    });
    this.obtenerUsuariosPorJefeInmediato();
  }

  private obtenerUsuariosPorJefeInmediato() {
    this.servicio.ObtenerUsuariosXJefe(this.usuarioActual.id).subscribe((ResponseTienda) => {
      this.ObjTiendas = TiendaXJefe.fromJsonList(ResponseTienda);
      this.ObtenerTipoSolicitud();
    });
  }

  mostrarAlerta(template: TemplateRef<any>, Titulo, Mensaje): any {
    this.tituloModal = Titulo;
    this.mensajeModal = Mensaje;
    this.modalRef = this.servicioModal.show(template);
  }

  ObtenerTipoSolicitud() {
    this.servicio.ObtenerTiposolicitud().subscribe(
      (respuestaTipoSolicitud) => {
        this.ObjTipoSolicitud = respuestaTipoSolicitud;
        this.loading = false;
      }
    );
  }

  get f() {
    return this.NovedadForm.controls;
  }

  adjuntarArchivo(event) {
    let archivoAdjunto = event.target.files[0];
    if (archivoAdjunto != null) {
      this.ArchivoAdjunto = archivoAdjunto;
    } else {
      this.ArchivoAdjunto = null;
    }
  }
 
  onSubmit(template: TemplateRef<any>) {
    this.submitted = true;
    if (this.NovedadForm.invalid) {
      return;
    }
    this.loading = true;
    this.retornarNovedades();
    this.servicio.agregarNovedad(this.retornarNovedades()).then(
      (iar: ItemAddResult) => {
        if (this.ArchivoAdjunto !== null) {
          let nombreArchivo = "Novedad-" + this.ArchivoAdjunto.name;
          this.servicio.agregarAdjuntoNovedad(iar.data.Id, nombreArchivo, this.ArchivoAdjunto).then(respuesta=>{
            this.loading = false;
            this.mostrarAlerta(template, "Guardado con éxito", "La actividad novedad se ha guardado con éxito");
            this.timer = setTimeout(() => {
              window.location.reload();
            }, 3000);
            this.loading = false;
            }).catch(
              (error)=>{
    
              }
          ); 
        }
        else{
          this.loading = false;
          this.mostrarAlerta(template, "Guardado con éxito", "La actividad novedad se ha guardado con éxito");
            this.timer = setTimeout(() => {
              window.location.reload();
            }, 3000);
        }               
      }, err => {
        alert('Error al crear una novedad');
      }
    );
  }

  retornarNovedades(): Novedad {
    //this.NovedadGuardar.tienda = this.NovedadForm.controls['txtTienda'].value;
    this.NovedadGuardar.fecha = this.NovedadForm.controls['txtFecha'].value;
    this.NovedadGuardar.tipoSolicitud = this.NovedadForm.controls['txtTipoSolicitud'].value;
    let IdResponsable = this.ObjTipoSolicitud.find(x=> x.Id === parseInt(this.NovedadForm.controls['txtTipoSolicitud'].value));
    this.NovedadGuardar.tienda = IdResponsable !== undefined ? IdResponsable.UsuarioResponsableId : null;
    this.NovedadGuardar.cantidad = this.NovedadForm.controls['txtCantidad'].value;
    this.NovedadGuardar.descripcion = this.NovedadForm.controls['txtDescripcion'].value;
    return this.NovedadGuardar;
  }
}
