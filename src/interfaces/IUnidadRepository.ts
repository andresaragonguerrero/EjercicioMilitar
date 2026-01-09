import { Unidad } from "../clases/Unidad";

export interface IUnidadRepository {
    guardar(unidad: Unidad): Promise<void>;
    listar(): Promise<Unidad[]>;
    borrarTodas(): Promise<void>;
    borrarPorNombre(nombre: string): Promise<void>;
}