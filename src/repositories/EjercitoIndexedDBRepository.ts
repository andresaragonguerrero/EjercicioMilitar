import { Ejercito } from "../clases/Ejercito.js";
import { IEjercitoRepository } from "../interfaces/IEjercitoRepository.js";
import { BaseIndexedDBRepository } from "./BaseIndexedDBRepository.js";

export class EjercitoIndexedDBRepository 
    extends BaseIndexedDBRepository<Ejercito> 
    implements IEjercitoRepository {
    
    constructor() {
        super("EjercitoDB", "ejercitos", 1);
    }

    async guardar(ejercito: Ejercito): Promise<void> {
        await this.ejecutarTransaccion<void>("readwrite", (store) => {
            return store.put(ejercito);
        });
    }

    async listar(): Promise<Ejercito[]> {
        return this.ejecutarTransaccion<Ejercito[]>("readonly", (store) => {
            return store.getAll();
        });
    }

    async borrarPorNombre(nombre: string): Promise<void> {
        await this.ejecutarTransaccion<void>("readwrite", (store) => {
            return store.delete(nombre);
        });
    }

    async borrarTodos(): Promise<void> {
        await this.ejecutarTransaccion<void>("readwrite", (store) => {
            return store.clear();
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