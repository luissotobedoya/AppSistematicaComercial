import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { default as pnp, CamlQuery, ListEnsureResult } from 'sp-pnp-js';
import { environment } from '../../environments/environment.prod';
import { Respuesta } from '../dominio/respuesta';
import { ActividadExtraordinaria } from '../dominio/actividadExtraordinaria';
import { Novedad } from '../dominio/novedad';

@Injectable()
export class SPServicio {
    constructor() {

    }

    public ObtenerConfiguracion() {
        const configuracionSharepoint = pnp.sp.configure({
            headers: {
                "Accept": "application/json; odata=verbose"
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    public ObtenerConfiguracionConPost() {

        const configuracionSharepoint = pnp.sp.configure({
            headers: {
                "Accept": "application/json; odata=verbose",
                'Content-Type': 'application/json;odata=verbose',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCIsImtpZCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZXN0dWRpb2RlbW9kYS5zaGFyZXBvaW50LmNvbUBjZDQ4ZWNkOS03ZTE1LTRmNGItOTdkOS1lYzgxM2VlNDJiMmMiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAY2Q0OGVjZDktN2UxNS00ZjRiLTk3ZDktZWM4MTNlZTQyYjJjIiwiaWF0IjoxNTY3MDA0Nzk3LCJuYmYiOjE1NjcwMDQ3OTcsImV4cCI6MTU2NzAzMzg5NywiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEBjZDQ4ZWNkOS03ZTE1LTRmNGItOTdkOS1lYzgxM2VlNDJiMmMiLCJuYW1laWQiOiIwNDM0YWJmYS02ODQ0LTQ4YTYtOTZhMi1kYzEzY2VmZTVhN2RAY2Q0OGVjZDktN2UxNS00ZjRiLTk3ZDktZWM4MTNlZTQyYjJjIiwib2lkIjoiMzA1YWI3YzgtMzdhYS00Nzc3LWI0YjAtNDNkYTdmYzJhNTQ0Iiwic3ViIjoiMzA1YWI3YzgtMzdhYS00Nzc3LWI0YjAtNDNkYTdmYzJhNTQ0IiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.WnJIhEgUQW-zNQ_VkxmltaMIp88guypuivN-CKm5y2rwd4wuoAwBbRlR3G3clSMDZ4j6AW2lcrHlO0HLWP_5-PjoLjmx02-cL4b5K0jj0Z35l8A8AjhX_XVsXcay8POQpOejjMjiHoPoY3C6YxUZ6_Y_T9jH5iUqcCSVwwytKLXOAHniUSsfoUZqJ5K6LM8K29Mimr7NLi5VZfUbdFCoX7SzZ9_w3Ynbe3pk6wQDVXuZEG6M8p5uYjIhQq-caDSQoPG_w37UYBdwEdhxxx3hvm6NVovL91BN5QaDc2xTluhU3mD2tCs6tsiWb51wDPRjLfcMAeM1XeBDAvY4GWF84A'
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    ObtenerInformacionSitio() {
        let respuesta = from(this.ObtenerConfiguracion().web.get());
        return respuesta;
    }

    ObtenerUsuarioActual() {
        let respuesta = from(this.ObtenerConfiguracion().web.currentUser.get());
        return respuesta;
    } 

    public async obtenerUsuarioActualPromesa(): Promise<any> {
        return await from(this.ObtenerConfiguracion().web.currentUser.get()).toPromise();
    }    

    ObtenerUsuariosXJefe(Jefe) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroUsuarios).items.filter("Jefe eq '" + Jefe + "'").select("Id", "Usuario/Title", "Usuario/Id").expand("Usuario").get());
        return respuesta;
    }

    ObtenerUsuarios(){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroUsuarios).items.filter("Responsable/Title ne '	Administrador Sistemática Comercial'").select("*","Responsable/Title","Id", "Usuario/Title", "Usuario/Id").expand("Responsable","Usuario").get());
        return respuesta;
    }

    ObtenerTiposolicitud() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroTipoSolicitud).items.get());
        return respuesta;
    }

    ObtenerCantidadPrioridadAlta(nombreLista) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.filter("Prioridad eq 'Alta'").get());
        return respuesta;
    }

    ObtenerCantidadPrioridadMedia(nombreLista) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.filter("Prioridad eq 'Media'").get());
        return respuesta;
    }

    ObtenerCantidadPrioridadBaja(nombreLista) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.filter("Prioridad eq 'Baja'").get());
        return respuesta;
    }

    obtenerJefeResponsable(ResponsableId) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroUsuarios).items.filter("ResponsableId eq '" + ResponsableId + "'").select("Id", "Usuario/Title", "Usuario/Id").expand("Usuario").get());
        return respuesta;
    }

    ObtenerRolUsuarioActual(usuarioId: number) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroUsuarios).items.select("Usuario/ID", "Usuario/Title", "Jefe/ID", "Jefe/Title", "Responsable/ID", "Responsable/Title").expand("Usuario", "Jefe", "Responsable").filter("UsuarioId eq " + usuarioId + " ").get());
        return respuesta;
    }

    public async obtenerRolUsuarioActualPromesa(usuarioId: number): Promise<any> {
        return await from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroUsuarios).items.select("Usuario/ID", "Usuario/Title", "Jefe/ID", "Jefe/Title", "Responsable/ID", "Responsable/Title").expand("Usuario", "Jefe", "Responsable").filter("UsuarioId eq " + usuarioId + " ").get()).toPromise();
    }

    ObtenerClasificaciones() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroClasificacion).items.orderBy("OrdenClasificacion", true).getAll());
        return respuesta;
    }

    ObtenerClasificacionesExtras() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroClasificacion).items.orderBy("OrdenClasificacion", true).getAll());
        return respuesta;
    }

    ObtenerRespuestaActividades(nombreLista, StringConsulta) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.filter(StringConsulta).select("*", "UsuarioResponsable/Title", "Fecha").expand("UsuarioResponsable").getAll(5000));
        return respuesta;
    }

    ObtenerSolicitudes(StringConsulta) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.Novedades).items.filter(StringConsulta).select("Tienda/Title", "TipoSolicitud/Title", "Descripcion", "Fecha", "Cantidad", "AttachmentFiles", "Attachments").expand("Tienda", "TipoSolicitud", "AttachmentFiles").getAll(5000));
        return respuesta;
    }

    ObtenerResponsablePorRol(rol: string) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroResponsables).items.filter("Title eq '" + rol + "'").get());
        return respuesta;
    }

    ObtenerProcesos(idResponsable: number, idClasificacion: number) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroActividadesGenerales).items.select("Proceso/Title", "Proceso/ID").expand("Proceso").filter("ResponsableId eq " + idResponsable + " and ClasificacionId eq " + idClasificacion + " ").get());
        return respuesta;
    }

    obtenerMaestroResponsable() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroResponsables).items.top(2).get());
        return respuesta;
    }

    ObtenerProcesosExtra() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroProcesos).items.get());
        return respuesta;
    }

    ObtenerActividades(idResponsable: number, idClasificacion: number, idProceso: number) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroActividadesGenerales).items.select("Title", "Id", "TipoValidacion", "Observaciones", "Responsable/Id", "Responsable/Title", "Clasificacion/Id", "Clasificacion/Title", "Proceso/Id", "Proceso/Title", "Tarea/ID", "Tarea/Title").expand("Responsable", "Clasificacion", "Proceso", "Tarea").filter("ResponsableId eq " + idResponsable + " and ClasificacionId eq " + idClasificacion + " and ProcesoId eq " + idProceso + "  ").get());
        return respuesta;
    }

    obtenerActividadesGenerales() {
        const campoOrdenar: string = "Title";
        const modoOrdnamientoASC = true;
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroActividadesGenerales).items.select("ID", "Title", "Clasificacion/Title", "Clasificacion/ID", "Proceso/Title", "Proceso/ID", "Tarea/Title", "Tarea/ID", "Responsable/Title", "Responsable/ID", "TipoValidacion", "Observaciones", "AttachmentFiles").expand("Clasificacion", "Proceso", "Tarea", "Responsable", "AttachmentFiles").orderBy(campoOrdenar, modoOrdnamientoASC).getAll(500));
        return respuesta;
    }

    VerificarExistenciaUsuarioEnGrupo(groupName: string, usuarioId: number) {
        let respuesta = from(this.ObtenerConfiguracion().web.siteGroups.getByName(groupName).users.getById(usuarioId).get());
        return respuesta;
    }

    ObtenerGruposUsuario(idUSuario: number) {
        let respuesta = from(this.ObtenerConfiguracion().web.siteUsers.getById(idUSuario).groups.get());
        return respuesta;
    }

    obtenerActividadesDelDia(nombreLista: string, usuarioId: number, rol: string, fecha: string) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.filter("UsuarioResponsableId eq '" + usuarioId + "' and Fecha gt datetime'" + fecha + "T00:00:00Z' and Fecha le datetime'"+fecha+"T23:59:59Z' ").getAll());
        return respuesta;
    }

    

    ObtenerElementosPorCaml(nombreLista: string, consulta: string) {
        //ejemplo de consulta caml "<View><Query>Aqui va el query</Query></View>";
        const xml = consulta;
        const q: CamlQuery = {
            ViewXml: xml,
        };
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).getItemsByCAMLQuery(q));
        return respuesta;
    }

    actualizarActividad(nombreLista: string, idRegistroActividad, ObjGuardar): any {
        
        return this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.getById(idRegistroActividad).update(ObjGuardar);
        // {
        //     Json: respuesta
        //     // Respuesta: respuesta.respuesta,
        //     // AprobacionActividad: respuesta.aprobacionActividad
        // }
    }

    agregarAdjuntoActividad(nombreLista: string, idRegistroActividad, nombreArchivo: string, archivo: File, id) {
        // let elemento = this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.getById(idRegistroActividad);
        // return elemento.attachmentFiles.add(nombreArchivo, archivo);
        let elemento = this.ObtenerConfiguracion().web.folders.getByName(nombreLista).files.add(nombreArchivo,archivo);
        return elemento;
        
    }

    actualizarPropiedadesAdjuntoActividad(nombreLista,idDoc, IdActividad, IdRegistro){
        // let elemento = this.ObtenerConfiguracion().web.getFolderByServerRelativePath('AdjuntosActGenerales')..update({
        //     IdActividad: IdActividad,
        //     IdRegistro: IdRegistro,
        // })
        let elemeto = this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.getById(idDoc).update({
            IdActividad: IdActividad,
            IdRegistro: IdRegistro,
        });
        return elemeto;
    }

    obtenerAdjuntosRegistroxUsuario(nombreLista: string, IdRegistroActividad) {
        // return this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.getById(IdRegistroActividad).attachmentFiles.get();
        return this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.filter("IdRegistro eq '"+IdRegistroActividad+"'").getAll();
    }

    obtenerAdjuntos(nombreLista: string, IdRegistroActividad, actividadRespuestaActualizar) {
        // return this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.getById(IdRegistroActividad).attachmentFiles.get();
        return this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.filter("IdActividad eq '"+actividadRespuestaActualizar.id+"' and IdRegistro eq '"+IdRegistroActividad+"'").getAll();
    }

    borrarAdjunto(nombreLista,id) {
        return this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.getById(id).delete();
        // return this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.getById(respuesta.id).attachmentFiles.getByName(nombreAdjunto).delete();
    }

    agregarActividadExtraordinaria(actividaextraordinaria: ActividadExtraordinaria) {
        let ObjActividad = {
            Fecha: actividaextraordinaria.fecha,
            UsuariosTiendaId: {
                results: actividaextraordinaria.usuariosId
            },
            Title: actividaextraordinaria.actividad,
            Clasificacion: actividaextraordinaria.clasificacion,
            Proceso: actividaextraordinaria.proceso,
            TipoValidacion: actividaextraordinaria.tipoValidacion,
            Prioridad: actividaextraordinaria.prioridad,
            Observaciones: actividaextraordinaria.observaciones
        };
        let elemento = this.ObtenerConfiguracion().web.lists.getByTitle(environment.actividadesExtraordinarias).items.add(ObjActividad);
        return elemento;
    }

    agregarNovedad(agregarNovedad: Novedad) {
        let objNovedad = {
            TiendaId: agregarNovedad.tienda,
            Fecha: agregarNovedad.fecha,
            TipoSolicitudId: agregarNovedad.tipoSolicitud,
            Descripcion: agregarNovedad.descripcion,
            Cantidad: agregarNovedad.cantidad,
            JefeTiendaId: agregarNovedad.jefeTienda,
            ResponsableId: agregarNovedad.responsable
        };
        let elemento = this.ObtenerConfiguracion().web.lists.getByTitle(environment.Novedades).items.add(objNovedad);
        return elemento;
    }

    obtenerActividadesConAdjuntoDeTiendaPorFecha(nombreLista: string, fecha: Date, usuarioTiendaId: number) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(nombreLista).items.select("ID", "Title", "Fecha", "Usuario/Title", "Usuario/ID", "Responsable", "Clasificacion", "Proceso", "TipoValidacion", "Respuesta", "Observaciones").expand("Usuario").filter("( (TipoValidacion eq 'Adjunto') or (TipoValidacion eq 'Checkbox y Aprobación') or (TipoValidacion eq 'Checkbox y Aprobación') or (TipoValidacion eq 'Checkbox y Reporte') or (TipoValidacion eq 'Reporte') or (TipoValidacion eq 'Validación')) and (UsuarioId eq " + usuarioTiendaId + ") ").get());
        return respuesta;
    }

    obtenerTiposValidacion() {
        let campoTipoValidacion = this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroActividadesGenerales).fields.getByInternalNameOrTitle(environment.nombreCampoTipoValidacion);
        let respuesta = campoTipoValidacion.select('Choices').get();
        return respuesta;
    }

    obtenerPrioridades() {
        let campoPrioridad = this.ObtenerConfiguracion().web.lists.getByTitle(environment.maestroActividadesGenerales).fields.getByInternalNameOrTitle(environment.nombreCampoPrioridad);
        let respuesta = campoPrioridad.select('Choices').get();
        return respuesta;
    }

    agregarAdjuntoNovedad(IdSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracion().web.lists.getByTitle(environment.Novedades).items.getById(IdSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    async validacionLista() {
        let respuesta = await this.ObtenerConfiguracion().web.lists.ensure("RespuestasActividades201901").then((ler: ListEnsureResult) => {
            if (ler.created) {
                return true;
            }
            else {
                return false;
            }
        });
    } 

    async ObtenerArchivoAdjunto(nombreLista: string, NombreDoc, fechahoy): Promise<any>{
        let respuesta = await this.ObtenerConfiguracionConPost().web.lists.getByTitle(nombreLista).items.select("*", "FileRef","FieldValuesAsText","File").expand("FieldValuesAsText", "File").filter("(Created ge datetime'"+fechahoy+"T00:01:00') and (Created le datetime'"+fechahoy+"T11:59:00') and FileLeafRef eq '"+NombreDoc+"'").get();
        return respuesta;
    }
}