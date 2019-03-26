import { parse } from "url";
import { Actividades } from "../mis-actividades/Actividades";

export class Respuesta {

    // constructor(
    //     public actividad: string,
    //     public fecha: Date,
    //     public usuario: any,
    //     public responsable: string,
    //     public clasificacion: string,
    //     public proceso: string,
    //     public tipoValidacion: string,
    //     public observaciones,
    //     public respuesta: boolean,
    //     public aprobacionActividad?: string,
    //     public id?: number,
    //     public adjunto?: File) { }

    // public static fromJson(element: any) {
    //     return new Respuesta(element.Title,
    //         element.Fecha,
    //         element.Usuario,
    //         element.Responsable,
    //         element.Clasificacion,
    //         element.Proceso,
    //         element.TipoValidacion,
    //         element.Observaciones,
    //         element.Respuesta,
    //         element.AprobacionActividad,
    //         element.Id)
    // }

    constructor(
        
        public fecha: Date,
        public usuario: any,
        public jsonActividad?: Actividades[],
        public jsonActividadExtra?: Actividades[],       
        public id?: number,
        public adjunto?: File) { }

    public static fromJson(element: any) {

        let jsonActividad = element.Json;
        let ValidarJson = jsonActividad !== null? jsonActividad.substr(0,1): "";
        if (ValidarJson === "[") {
            jsonActividad = JSON.parse(jsonActividad);
        }
        else {
            jsonActividad = jsonActividad !== null ? jsonActividad.slice(0,jsonActividad.length-1) : "";
            jsonActividad = jsonActividad.length > 0 ? "["+ jsonActividad + "]": "";
            jsonActividad = jsonActividad.length > 0 ? JSON.parse(jsonActividad) : "";            
        }

        
        let jsonActividadExtra = element.JsonExtraordinario;
        let ValidarJsonAE = jsonActividadExtra !== null? jsonActividadExtra.substr(0,1): "";
        if (ValidarJsonAE === "[") {
            jsonActividadExtra = JSON.parse(jsonActividadExtra);
        }
        else {
            jsonActividadExtra = jsonActividadExtra !== null ? jsonActividadExtra.slice(0,jsonActividadExtra.length-1) : "";
            jsonActividadExtra = jsonActividadExtra.length > 0 ? "["+ jsonActividadExtra + "]": "";
            jsonActividadExtra = jsonActividadExtra.length > 0 ? JSON.parse(jsonActividadExtra) : "";         
        }
        
        

        return new Respuesta( 
            element.Fecha,
            element.UsuarioResponsableId,
            jsonActividad,
            jsonActividadExtra,
            element.Id)
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }

}