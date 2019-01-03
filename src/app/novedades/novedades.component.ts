import { Component, OnInit, TemplateRef } from '@angular/core';
import { SPServicio } from '../servicios/sp.servicio';
import { Novedad } from '../dominio/novedad';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TiendaXJefe } from '../dominio/TiendaXJefe';
import { ItemAddResult } from 'sp-pnp-js';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


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
  NovedadGuardar:Novedad;
  tituloModal: any;
  mensajeModal: any;
  public modalRef: BsModalRef;
  timer: any;
  
  constructor(private servicio:SPServicio, private formBuilder: FormBuilder,private servicioModal: BsModalService) {
    
    this.NovedadGuardar = new Novedad(null,null,null,"",null);
   }

  ngOnInit() {
    this.loading = true;
    this.NovedadForm = this.formBuilder.group({
      txtTienda: ["", Validators.required],
      txtFecha: ["", Validators.required],
      txtTipoSolicitud: ["", Validators.required],
      txtCantidad: ["", Validators.required],
      txtDescripcion: ["", Validators.required]
    });

    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        let Usuario = Response.Id;
        this.servicio.ObtenerUsuariosXJefe(Usuario).subscribe(
          (ResponseTienda) => {
            this.ObjTiendas = TiendaXJefe.fromJsonList(ResponseTienda);   
            this.ObtenerTipoSolicitud();         
          }
        );
      }
    );
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

  onSubmit(template: TemplateRef<any>) {
    this.submitted = true;
    if (this.NovedadForm.invalid) {      
      return;
    }
    this.loading = true;
    this.servicio.agregarNovedad(this.retornarNovedades()).then(
      (iar: ItemAddResult) => {
          this.mostrarAlerta(template, "Guardado con éxito", "La actividad novedad se ha guardado con éxito");
           this.timer = setTimeout(() => {
             window.location.reload();
           }, 3000);
           this.loading = false;      
      }, err => {
        alert('Error al crear una novedad');
      }
    );


  }

  retornarNovedades(): Novedad {
    this.NovedadGuardar.tienda=this.NovedadForm.controls['txtTienda'].value;
    this.NovedadGuardar.fecha=this.NovedadForm.controls['txtFecha'].value;
    this.NovedadGuardar.tipoSolicitud=this.NovedadForm.controls['txtTipoSolicitud'].value;
    this.NovedadGuardar.cantidad=this.NovedadForm.controls['txtCantidad'].value;
    this.NovedadGuardar.descripcion=this.NovedadForm.controls['txtDescripcion'].value;    
    return this.NovedadGuardar;
  }



}
