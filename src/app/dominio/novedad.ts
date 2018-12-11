export class Novedad{
    
    tienda:Number;
    fecha:Date;
    tipoSolicitud:number;
    descripcion:string;
    cantidad:number;

    constructor(tienda: Number, fecha?:Date, tipoSolicitud?:number, descripcion?:string, cantidad?:number) {
        this.tienda=tienda;
        this.fecha=fecha;
        this.tipoSolicitud=tipoSolicitud;
        this.descripcion=descripcion;
        this.cantidad=cantidad;
     }    

}