export abstract class BaseIndexedDBRepository<T> {
    constructor(
        protected readonly dbName: string,
        protected readonly storeName: string,
        protected readonly dbVersion: number,
        protected readonly keyPath: string = "nombre"
    ) { }

    protected abrirDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                console.log(`Upgrade needed: ${event.oldVersion} → ${this.dbVersion}`);
                const db = request.result;

                const storesNecesarios = ["unidades", "ejercitos"];

                storesNecesarios.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        console.log(`Creando store: ${storeName}`);
                        db.createObjectStore(storeName, { keyPath: "nombre" });
                    }
                });
            };

            request.onsuccess = () => {
                console.log(`DB abierta: ${this.dbName}, stores:`,
                    Array.from(request.result.objectStoreNames));
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Error abriendo DB:', request.error);
                reject(request.error);
            };

            request.onblocked = () => {
                console.warn(`DB ${this.dbName} bloqueada`);
            };
        });
    }

    protected ejecutarTransaccion<R>(
        modo: IDBTransactionMode,
        operacion: (store: IDBObjectStore) => IDBRequest
    ): Promise<R> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.abrirDB();
                const tx = db.transaction(this.storeName, modo);
                const store = tx.objectStore(this.storeName);

                const request = operacion(store);

                request.onsuccess = () => resolve(request.result as R);
                request.onerror = () => reject(request.error);
                tx.onerror = () => reject(tx.error);
            } catch (error) {
                reject(error);
            }
        });
    }
}