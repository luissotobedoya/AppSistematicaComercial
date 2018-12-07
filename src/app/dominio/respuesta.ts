export class Respuesta {

    constructor(
        public actividad: string,
        public fecha: Date,
        public usuario: any,
        public responsable: string,
        public clasificacion: string,
        public proceso: string,
        public tipoValidacion: string,
        public observaciones,
        public respuesta: boolean,
        public aprobacionActividad?: string,
        public id?: number,
        public adjunto?: File) { }

    public static fromJson(element: any) {
        return new Respuesta(element.Title,
            element.Fecha,
            element.Usuario,
            element.Responsable,
            element.Clasificacion,
            element.Proceso,
            element.TipoValidacion,
            element.Observaciones,
            element.Respuesta,
            element.AprobacionActividad,
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