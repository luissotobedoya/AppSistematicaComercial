export class Responsable{

    constructor(public titulo: string, public usuario: number, public id?: number) { }

    public static fromJson(element: any) {
        return new Responsable(element.Title, element.Usuario, element.Id);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}