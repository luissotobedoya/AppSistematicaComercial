export class ActividadExtraordinaria{

    fecha: Date;
    usuariosId: Number[]=[];
    actividad:string;
    clasificacion:string;
    proceso:string;
    tipoValidacion:string;

    constructor(fecha:Date,usuariosId: Number[],actividad:string,clasificacion:string,proceso:string,tipoValidacion:string){
        this.fecha=fecha;
        this.usuariosId=usuariosId;
        this.actividad=actividad;
        this.proceso=proceso;
        this.tipoValidacion=tipoValidacion;
    }

    

}