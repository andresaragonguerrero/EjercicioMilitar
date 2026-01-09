import { Ejercito } from "../clases/Ejercito.js";
import { Unidad } from "../clases/Unidad.js";

export interface IEjercitoService {
    crearEjercito(nombre: string, fondo: number): Promise<Ejercito>;
    listarEjercitos(): Promise<Ejercito[]>;
    borrarEjercito(nombre: string): Promise<void>;
    borrarTodosEjercitos(): Promise<void>;
    agregarUnidadAEjercito(
        ejercitoNombre: string, 
        divisionNombre: string, 
        unidad: Unidad
    ): Promise<void>;
}