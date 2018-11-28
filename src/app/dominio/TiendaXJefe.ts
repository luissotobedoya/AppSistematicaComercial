export class TiendaXJefe{
    
    constructor(public nombre: string, public id?: number) { }

    public static fromJson(element: any) {
        return new TiendaXJefe(element.Usuario.Title, element.Usuario.Id);
    }

    public static fromJsonList(elements: any) {
        let list = [];
        for (let i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }

}