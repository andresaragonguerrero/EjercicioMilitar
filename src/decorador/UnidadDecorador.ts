// src/decorators/DecoradorUnidad.ts
import { Unidad } from "../clases/Unidad.js";
import type { IBlindado } from "../interfaces/IBlindado.js";
import type { IDestructor } from "../interfaces/IDestructor.js";
import type { IMovil } from "../interfaces/IMovil.js";

// Decorador base
export abstract class UnidadDecorador implements IBlindado, IDestructor, IMovil {
    protected unidadDecorada: Unidad;

    constructor(unidad: Unidad) {
        this.unidadDecorada = unidad;
    }

    // Delegar métodos base
    get nombre(): string {
        return this.unidadDecorada.nombre;
    }

    get velocidad(): number {
        return this.unidadDecorada.velocidad;
    }

    get blindaje(): number {
        return this.unidadDecorada.blindaje;
    }

    get potenciaDeFuego(): number {
        return this.unidadDecorada.potenciaDeFuego;
    }

    get precio(): number {
        return this.unidadDecorada.precio;
    }

    capacidadDeMovimiento(): number {
        return this.unidadDecorada.capacidadDeMovimiento();
    }

    resistenciaAlAtaque(): number {
        return this.unidadDecorada.resistenciaAlAtaque();
    }

    capacidadDeDestruccion(): number {
        return this.unidadDecorada.capacidadDeDestruccion();
    }
}

// Decorador para aumentar velocidad 30%
export class DecoradorVelocidad extends UnidadDecorador {
    private readonly incremento = 0.3;

    get velocidad(): number {
        return this.unidadDecorada.velocidad * (1 + this.incremento);
    }

    capacidadDeMovimiento(): number {
        return this.velocidad;
    }

    get precio(): number {
        // Aumentar precio un 15% por mejora
        return this.unidadDecorada.precio * 1.15;
    }
}

// Decorador para aumentar blindaje 30%
export class DecoradorBlindaje extends UnidadDecorador {
    private readonly incremento = 0.3;

    get blindaje(): number {
        return this.unidadDecorada.blindaje * (1 + this.incremento);
    }

    resistenciaAlAtaque(): number {
        return this.blindaje;
    }

    get precio(): number {
        return this.unidadDecorada.precio * 1.2;
    }
}

// Decorador que combina ambos: velocidad y blindaje
export class DecoradorCompleto extends UnidadDecorador {
    private readonly decoradorVelocidad: DecoradorVelocidad;
    private readonly decoradorBlindaje: DecoradorBlindaje;

    constructor(unidad: Unidad) {
        super(unidad);
        this.decoradorVelocidad = new DecoradorVelocidad(unidad);
        this.decoradorBlindaje = new DecoradorBlindaje(unidad);
    }

    get velocidad(): number {
        return this.decoradorVelocidad.velocidad;
    }

    get blindaje(): number {
        return this.decoradorBlindaje.blindaje;
    }

    get precio(): number {
        // Precio base + incrementos
        return this.unidadDecorada.precio * 1.35;
    }

    capacidadDeMovimiento(): number {
        return this.velocidad;
    }

    resistenciaAlAtaque(): number {
        return this.blindaje;
    }
}