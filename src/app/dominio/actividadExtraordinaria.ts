export class ActividadExtraordinaria{

    fecha: Date;
    usuariosId: Number[]=[];
    actividad:string;
    clasificacion:string;
    proceso:string;
    tipoValidacion:string;
    prioridad:string;
    observaciones:string;

    constructor(fecha:Date,usuariosId: Number[],actividad:string,clasificacion:string,proceso:string,tipoValidacion:string, prioridad:string, observaciones: string){
        this.fecha=fecha;
        this.usuariosId=usuariosId;
        this.actividad=actividad;
        this.proceso=proceso;
        this.tipoValidacion=tipoValidacion;
        this.prioridad = prioridad;
        this.observaciones= observaciones;
    }
}