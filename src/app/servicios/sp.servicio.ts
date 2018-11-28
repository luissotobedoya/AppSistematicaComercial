import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { default as pnp, ItemAddResult, CamlQuery } from 'sp-pnp-js';
import { environment } from '../../environments/environment';
import { Respuesta } from '../dominio/respuesta';
import { ActividadExtraordinaria } from '../dominio/actividadExtraordinaria';

@Injectable()
export class SPServicio {
    constructor() { 
        
    }

    public obtenerConfiguracion() {
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
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IndVTG1ZZnNxZFF1V3RWXy1oeFZ0REpKWk00USIsImtpZCI6IndVTG1ZZnNxZFF1V3RWXy1oeFZ0REpKWk00USJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZXN0dWRpb2RlbW9kYS5zaGFyZXBvaW50LmNvbUBjZDQ4ZWNkOS03ZTE1LTRmNGItOTdkOS1lYzgxM2VlNDJiMmMiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAY2Q0OGVjZDktN2UxNS00ZjRiLTk3ZDktZWM4MTNlZTQyYjJjIiwiaWF0IjoxNTQzNDE1MTQ2LCJuYmYiOjE1NDM0MTUxNDYsImV4cCI6MTU0MzQ0NDI0NiwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEBjZDQ4ZWNkOS03ZTE1LTRmNGItOTdkOS1lYzgxM2VlNDJiMmMiLCJuYW1laWQiOiI2MjRmZTkwZS04YWQyLTRjNzItOWRhNy00ZmE1ODg4OGNlMDdAY2Q0OGVjZDktN2UxNS00ZjRiLTk3ZDktZWM4MTNlZTQyYjJjIiwib2lkIjoiZjNlZDU4YjUtYjc5OS00NmYwLTlkZGYtOGYwZjIwNmZmOGJlIiwic3ViIjoiZjNlZDU4YjUtYjc5OS00NmYwLTlkZGYtOGYwZjIwNmZmOGJlIiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.Bx2S03gsByqdDFwOnQ-bzdwQ7H05PpCWCW6mh0hPy0sAHwRt1VErFdejTkzdh1HEXKVhOSp_IbcpzsdNnFK2UIhc_W2JFz2Ws8RFntEl3XFDQZizGlXrMfiInebZvTbT0aG1Wh9xhdcRUFCDsN4am85XZ746zFdv4Apt-aumoJAZ4U_5n8Oq7jTLEYh8m93WigsYsFhuDQHhnpxppn4FmZBp09C_fKRWtyJMJ07iJ_QzvtZvFHGPlsU6oSjDjn-x_989TXazPAZJWMmKpUz3sZVQJxo46mPQh6B71ffD2v07vzbzjF0pGC4yyUD4j-MSqqpx9EoljUH2YxxASFyXyQ'
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    ObtenerInformacionSitio() {
        let respuesta = from(this.obtenerConfiguracion().web.get());
        return respuesta;
    }

    ObtenerUsuarioActual() {
        let respuesta = from(this.obtenerConfiguracion().web.currentUser.get());
        return respuesta;
    }

    ObtenerTiendaXJefe(Jefe){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.maestroUsuarios).items.filter("Jefe eq '"+Jefe+"'").select("Id","Usuario/Title","Usuario/Id").expand("Usuario").get());
        return respuesta;
    }

    ObtenerRolUsuarioActual(usuarioId : number){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.maestroUsuarios).items.select("Usuario/ID","Usuario/Title", "Jefe/ID", "Jefe/Title", "Responsable/ID", "Responsable/Title").expand("Usuario", "Jefe", "Responsable").filter("UsuarioId eq "+usuarioId+" ").get());
        return respuesta;
    }

    ObtenerClasificaciones() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.maestroClasificacion).items.orderBy("OrdenClasificacion", true).getAll());
        return respuesta;
    }

    ObtenerClasificacionesExtras() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.maestroClasificacion).items.orderBy("OrdenClasificacion", true).filter("AplicaTienda eq '1'").get());
        return respuesta;
    }

    ObtenerResponsablePorRol(rol: string){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.maestroResponsables).items.filter("Title eq '" + rol + "'").get());
        return respuesta;
    }

    ObtenerProcesos(idResponsable: number, idClasificacion: number) {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.maestroActividadesGenerales).items.select("Proceso/Title", "Proceso/ID").expand("Proceso").filter("ResponsableId eq "+idResponsable+" and ClasificacionId eq "+idClasificacion+" ").get());
        return respuesta;
    }

    ObtenerProcesosExtra() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.maestroProcesos).items.get());
        return respuesta;
    }

    ObtenerActividades(idResponsable: number, idClasificacion: number, idProceso: number){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.maestroActividadesGenerales).items.select("Title", "Id", "TipoValidacion", "Observaciones", "Responsable/Id", "Responsable/Title", "Clasificacion/Id", "Clasificacion/Title", "Proceso/Id", "Proceso/Title", "Tarea/ID", "Tarea/Title").expand("Responsable","Clasificacion", "Proceso", "Tarea").filter("ResponsableId eq "+idResponsable+" and ClasificacionId eq "+idClasificacion+" and ProcesoId eq "+idProceso+"  ").get());
        return respuesta;
    }

    VerificarExistenciaUsuarioEnGrupo(groupName: string, usuarioId: number) {
        let respuesta = from(this.obtenerConfiguracion().web.siteGroups.getByName(groupName).users.getById(usuarioId).get());
        return respuesta;
    }

    ObtenerGruposUsuario(idUSuario: number) {
        let respuesta = from(this.obtenerConfiguracion().web.siteUsers.getById(idUSuario).groups.get());
        return respuesta;
    }

    ObtenerElementosPorCaml(nombreLista: string, consulta: string) {
        //ejemplo de consulta caml "<View><Query>Aqui va el query</Query></View>";
        const xml = consulta;
        const q: CamlQuery = {
            ViewXml: xml,
        };
        let respuesta = from(this.ObtenerConfiguracionConPost().web.lists.getByTitle(nombreLista).getItemsByCAMLQuery(q));
        return respuesta;
    }

    actualizarActividad(nombreLista: string, respuesta: Respuesta): any{
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(nombreLista).items.getById(respuesta.id).update({
            Respuesta: respuesta.respuesta
        });
    }

    agregarAdjuntoActividad(nombreLista: string, respuesta: Respuesta, nombreArchivo : string, archivo : File){
        let elemento = this.ObtenerConfiguracionConPost().web.lists.getByTitle(nombreLista).items.getById(respuesta.id);
        return elemento.attachmentFiles.add(nombreArchivo, archivo);
    }

    obtenerAdjuntos(nombreLista: string, respuesta: Respuesta){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(nombreLista).items.getById(respuesta.id).attachmentFiles.get();
    }

    borrarAdjunto(nombreLista: string, respuesta: Respuesta, nombreAdjunto: string){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(nombreLista).items.getById(respuesta.id).attachmentFiles.getByName(nombreAdjunto).delete();
    }

    agregarActividadExtraordinaria(actividaextraordinaria:ActividadExtraordinaria){
        let ObjActividad = {
           Fecha: actividaextraordinaria.fecha,
           UsuariosTiendaId: {
                    results: actividaextraordinaria.usuariosId
                   }, 
           Title:actividaextraordinaria.actividad,
           Clasificacion:actividaextraordinaria.clasificacion,
           Proceso:actividaextraordinaria.proceso,
           TipoValidacion:actividaextraordinaria.tipoValidacion
        };
        let elemento = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.actividadesExtraordinarias).items.add( ObjActividad );
       return elemento;
   }
}