import { Unidad } from "../clases/Unidad.js";
import type { IBlindado } from "../interfaces/IBlindado.js";
import type { IDestructor } from "../interfaces/IDestructor.js";
import type { IMovil } from "../interfaces/IMovil.js";
import type { IUnidadAmericana } from "../interfaces/IUnidadAmericana.js";

export class UnidadAmericanaAdaptador implements IBlindado, IDestructor, IMovil {
    private readonly unidadAmericana: IUnidadAmericana;
    private readonly CONVERSION_MPH_A_KMH = 1.60934;

    constructor(unidadAmericana: IUnidadAmericana) {
        this.unidadAmericana = unidadAmericana;
    }

    // Convertir mph a km/h
    get velocidad(): number {
        return this.unidadAmericana.velocidadMPH * this.CONVERSION_MPH_A_KMH;
    }

    get blindaje(): number {
        return this.unidadAmericana.blindaje;
    }

    get potenciaDeFuego(): number {
        return this.unidadAmericana.potenciaDeFuego;
    }

    get precio(): number {
        return this.unidadAmericana.precioUSD * 0.85;
    }

    get nombre(): string {
        return this.unidadAmericana.nombre;
    }

    capacidadDeMovimiento(): number {
        return this.velocidad;
    }

    resistenciaAlAtaque(): number {
        return this.blindaje;
    }

    capacidadDeDestruccion(): number {
        return this.potenciaDeFuego;
    }

    toUnidad(): Unidad {
        return new Unidad(
            this.velocidad,
            this.blindaje,
            this.potenciaDeFuego,
            this.precio,
            this.nombre
        );
    }
}

export const MarshallTank: IUnidadAmericana = {
    velocidadMPH: 45,
    blindaje: 8.5,
    potenciaDeFuego: 12.5,
    precioUSD: 85000,
    nombre: "Marshall Tank M1A2"
};