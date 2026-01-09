import { Ejercito } from "../clases/Ejercito.js";

export interface IEjercitoRepository {
    guardar(ejercito: Ejercito): Promise<void>;
    listar(): Promise<Ejercito[]>;
    borrarPorNombre(nombre: string): Promise<void>;
    borrarTodos(): Promise<void>;
}
