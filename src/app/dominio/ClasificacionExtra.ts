export class Clasificacion {
    
    constructor(public nombre: string, public orden: number, public id?: number) { }

    public static fromJson(element: any) {
        return new Clasificacion(element.Title, element.OrdenClasificacion, element.Id);
    }

    public static fromJsonList(elements: any) {
        let list = [];
        for (let i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }

}