import { Unidad } from "./Unidad.js";

export class Division {
    private readonly unidades: Unidad[] = [];

    constructor(public nombre: string) { }

    getUnidades(): readonly Unidad[] {
        return this.unidades;
    }

    agregarUnidad(unidad: Unidad) {
        this.unidades.push(unidad);
    }

    cantidadDeUnidades(): number {
        return this.unidades.length;
    }

    potenciaDeFuegoTotal(): number {
        return this.unidades.reduce((acc, unidad) => acc + unidad.potenciaDeFuego, 0);
    }

    blindajeTotal(): number {
        return this.unidades.reduce((acc, unidad) => acc + unidad.blindaje, 0);
    }

    velocidadTotal(): number {
        return this.unidades.reduce((acc, unidad) => acc + unidad.velocidad, 0);
    }

    precioTotal(): number {
        return this.unidades.reduce((acc, unidad) => acc + unidad.precio, 0);
    }
}