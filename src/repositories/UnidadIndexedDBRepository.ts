import { Unidad } from "../clases/Unidad.js";
import { IUnidadRepository } from "../interfaces/IUnidadRepository.js";
import { BaseIndexedDBRepository } from "./BaseIndexedDBRepository.js";

export class UnidadIndexedDBRepository 
    extends BaseIndexedDBRepository<Unidad> 
    implements IUnidadRepository {
    
    constructor() {
        super("EjercitoDB", "unidades", 1);
    }

    async guardar(unidad: Unidad): Promise<void> {
        await this.ejecutarTransaccion<void>("readwrite", (store) => {
            return store.put(unidad);
        });
    }

    async listar(): Promise<Unidad[]> {
        return this.ejecutarTransaccion<Unidad[]>("readonly", (store) => {
            return store.getAll();
        });
    }

    async borrarTodas(): Promise<void> {
        await this.ejecutarTransaccion<void>("readwrite", (store) => {
            return store.clear();
        });
    }

    async borrarPorNombre(nombre: string): Promise<void> {
        await this.ejecutarTransaccion<void>("readwrite", (store) => {
            return store.delete(nombre);
        });
    }

    async resetDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(this.dbName);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}