export class RespuestaActividad {
    constructor(public nombreAcitvidad: string, public nombreTienda?: string, public respuesta?:boolean, public fecha?:Date, public prioridad?:string) { }

    public static fromJson(element: any) {
        return new RespuestaActividad(element.Title, element.Usuario.Title, element.Respuesta, element.Fecha,element.Prioridad);
    }

    public static fromJsonList(elements: any) {
        let list = [];
        for (let i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));  
        }
        return list;
    }
}