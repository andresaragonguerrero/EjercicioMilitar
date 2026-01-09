import { Unidad } from "../clases/Unidad.js";

export class UnidadFactory {
    static crearUnidad(
        velocidad: number,
        blindaje: number,
        potenciaDeFuego: number,
        precio: number,
        nombre: string,
    ): Unidad {
        // Validaciones
        if (!nombre || nombre.trim().length === 0) {
            throw new Error("El nombre de la unidad es obligatorio");
        }

        if (nombre.trim().length < 2) {
            throw new Error("El nombre debe tener al menos 2 caracteres");
        }

        if (velocidad < 0) throw new Error("La velocidad no puede ser negativa");
        if (blindaje < 0) throw new Error("El blindaje no puede ser negativo");
        if (potenciaDeFuego < 0) throw new Error("La potencia de fuego no puede ser negativa");
        if (precio < 0) throw new Error("El precio no puede ser negativo");

        if (velocidad > 50) throw new Error("La velocidad no puede ser mayor a 50");
        if (blindaje > 50) throw new Error("El blindaje no puede ser mayor a 50");
        if (potenciaDeFuego > 50) throw new Error("La potencia de fuego no puede ser mayor a 50");
        if (precio > 10000) throw new Error("El precio no puede ser mayor a 10000");

        return new Unidad(velocidad, blindaje, potenciaDeFuego, precio, nombre);
    }
}
