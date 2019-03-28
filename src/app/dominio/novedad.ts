export class Novedad{
    
    tienda:Number;
    fecha:Date;
    tipoSolicitud:number;
    descripcion:string;
    cantidad:number;
    jefeTienda: number;
    responsable: number;

    constructor(tienda: Number, fecha?:Date, tipoSolicitud?:number, descripcion?:string, cantidad?:number, jefeTienda?: number, responsable?: number) {
        this.tienda=tienda;
        this.fecha=fecha;
        this.tipoSolicitud=tipoSolicitud;
        this.descripcion=descripcion;
        this.cantidad=cantidad;
        this.jefeTienda=jefeTienda;
        this.responsable=responsable;
     }    

}