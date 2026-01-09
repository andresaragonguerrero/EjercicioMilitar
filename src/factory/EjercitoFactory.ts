import { Ejercito } from "../clases/Ejercito.js";
import { Division } from "../clases/Division.js";

export class EjercitoFactory {
    static crearEjercito(nombre: string, fondo: number): Ejercito {
        if (!nombre) throw new Error("El nombre del ejército es obligatorio");
        if (fondo < 0) throw new Error("El fondo del ejército no puede ser negativo");

        return new Ejercito(nombre, fondo);
    }

    static crearDivision(nombre: string): Division {
        if (!nombre) throw new Error("El nombre de la división es obligatorio");

        return new Division(nombre);
    }
}
