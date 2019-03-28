export class Usuario {

    id: number;
    nombre: string;
    rol: string;
    jefeId: number;
    nombreJefe: string;

    constructor(id: number, nombre: string, rol: string, jefe?: number, nombreJefe?: string){
        this.id = id;
        this.nombre = nombre;
        this.rol = rol;
        this.jefeId = jefe;
        this.nombreJefe=nombreJefe;
    }
}