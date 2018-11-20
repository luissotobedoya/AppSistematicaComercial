import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { default as pnp, ItemAddResult, CamlQuery } from 'sp-pnp-js';
import { environment } from '../../environments/environment';
import { Respuesta } from '../dominio/respuesta';

@Injectable()
export class SPServicio {
    constructor() { }

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
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IndVTG1ZZnNxZFF1V3RWXy1oeFZ0REpKWk00USIsImtpZCI6IndVTG1ZZnNxZFF1V3RWXy1oeFZ0REpKWk00USJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZXN0dWRpb2RlbW9kYS5zaGFyZXBvaW50LmNvbUBjZDQ4ZWNkOS03ZTE1LTRmNGItOTdkOS1lYzgxM2VlNDJiMmMiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAY2Q0OGVjZDktN2UxNS00ZjRiLTk3ZDktZWM4MTNlZTQyYjJjIiwiaWF0IjoxNTQyNzMyOTYxLCJuYmYiOjE1NDI3MzI5NjEsImV4cCI6MTU0Mjc2MjA2MSwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEBjZDQ4ZWNkOS03ZTE1LTRmNGItOTdkOS1lYzgxM2VlNDJiMmMiLCJuYW1laWQiOiI2MjRmZTkwZS04YWQyLTRjNzItOWRhNy00ZmE1ODg4OGNlMDdAY2Q0OGVjZDktN2UxNS00ZjRiLTk3ZDktZWM4MTNlZTQyYjJjIiwib2lkIjoiZjNlZDU4YjUtYjc5OS00NmYwLTlkZGYtOGYwZjIwNmZmOGJlIiwic3ViIjoiZjNlZDU4YjUtYjc5OS00NmYwLTlkZGYtOGYwZjIwNmZmOGJlIiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.Ii54jWzCGDev8m0Yzg9GQGWJw65WoMPGlsewFcEhJ8gMx4keUD5izvdobOBfwox6P4ESCsRqIHuCEhk7zcHMX4fy6jIt0GgaUHLWtRQhZHGADsdcs9plpDss8W_QGrSfk14Bwe9QPxTgc1Vx0_yTaWZtY36BXQ9Prgm5uaQdqqHBrdGzYZmKzSHLoqB_SKrSJPJuwpW1WkggcCzJkNn8DFoC8fscDr9rNtX3f_bs9nIE0f_3ZYRfdwZV2cSF5Wu3KvzBpEHFZvbyfQlvyncfZYogWCMyCj7_V8F_pBp9C-EXxcYB3fci1-EDUlLJslwTSu8eRHI9LRt1WmHjhfxyuA'
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

    ObtenerRolUsuarioActual(usuarioId : number){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.maestroUsuarios).items.select("Usuario/ID","Usuario/Title", "Jefe/ID", "Jefe/Title", "Responsable/ID", "Responsable/Title").expand("Usuario", "Jefe", "Responsable").filter("UsuarioId eq "+usuarioId+" ").get());
        return respuesta;
    }

    ObtenerClasificaciones() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.maestroClasificacion).items.orderBy("OrdenClasificacion", true).getAll());
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

    actuaiizarActividad(nombreLista: string, respuesta: Respuesta): any{
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(nombreLista).items.getById(respuesta.id).update({
            Respuesta: respuesta.respuesta
        });
    }

    agregarAdjuntoActividad(nombreLista: string, respuesta: Respuesta, nombreArchivo : string, archivo : File){
        let elemento = this.ObtenerConfiguracionConPost().web.lists.getByTitle(nombreLista).items.getById(respuesta.id);
        return elemento.attachmentFiles.add(nombreArchivo, archivo);
    }
}