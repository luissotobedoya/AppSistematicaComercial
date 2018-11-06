export class Usuario {

    id: number;
    nombre: string;
    roles: string[];

    constructor(id: number, nombre: string, roles: string[]){
        this.id = id;
        this.nombre = nombre;
        this.roles = roles;
    }
}