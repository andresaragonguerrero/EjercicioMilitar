import { Unidad } from "../clases/Unidad.js";

export interface IUnidadService {
    crearUnidad(
        velocidad: number,
        blindaje: number,
        potenciaDeFuego: number,
        precio: number,
        nombre: string
    ): Promise<Unidad>;
    listarUnidades(): Promise<Unidad[]>;
    guardarUnidad(unidad: Unidad): Promise<void>;
    borrarUnidad(nombre: string): Promise<void>;
    borrarTodasUnidades(): Promise<void>;
}