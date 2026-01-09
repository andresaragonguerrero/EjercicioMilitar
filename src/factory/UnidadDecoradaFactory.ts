// src/factory/UnidadDecoradaFactory.ts
import { Unidad } from "../clases/Unidad.js";
import { DecoradorVelocidad, DecoradorBlindaje, DecoradorCompleto } from "../decorador/UnidadDecorador.js";
import { UnidadAmericanaAdaptador, MarshallTank } from "../adaptadores/UnidadAmericanaAdaptador.js";

export class UnidadDecoradaFactory {
    // Crear unidad con velocidad aumentada
    static crearUnidadVeloz(unidadBase: Unidad): DecoradorVelocidad {
        return new DecoradorVelocidad(unidadBase);
    }

    // Crear unidad con blindaje aumentado
    static crearUnidadBlindada(unidadBase: Unidad): DecoradorBlindaje {
        return new DecoradorBlindaje(unidadBase);
    }

    // Crear unidad con ambas mejoras
    static crearUnidadMejorada(unidadBase: Unidad): DecoradorCompleto {
        return new DecoradorCompleto(unidadBase);
    }

    // Crear unidad americana adaptada
    static crearUnidadAmericana(): UnidadAmericanaAdaptador {
        return new UnidadAmericanaAdaptador(MarshallTank);
    }

    // Crear unidad americana y mejorarla
    static crearUnidadAmericanaMejorada(): DecoradorCompleto {
        const adaptador = this.crearUnidadAmericana();
        const unidadBase = adaptador.toUnidad();
        return this.crearUnidadMejorada(unidadBase);
    }
}