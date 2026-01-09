import type { IBlindado } from "../interfaces/IBlindado.js";
import type { IDestructor } from "../interfaces/IDestructor.js";
import type { IMovil } from "../interfaces/IMovil.js";

export class Unidad implements IBlindado, IDestructor, IMovil {
    constructor(
        public velocidad: number,
        public blindaje: number,
        public potenciaDeFuego: number,
        public precio: number,
        public nombre: string
    ) { }

    capacidadDeMovimiento(): number {
        return this.velocidad;
    }

    resistenciaAlAtaque(): number {
        return this.blindaje;
    }

    capacidadDeDestruccion(): number {
        return this.potenciaDeFuego;
    }
}