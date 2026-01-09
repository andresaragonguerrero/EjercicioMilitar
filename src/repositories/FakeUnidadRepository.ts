import { Unidad } from "../clases/Unidad.js";
import { IUnidadRepository } from "../interfaces/IUnidadRepository.js";

export class FakeUnidadRepository implements IUnidadRepository {
    private unidades: Unidad[] = [];
    private nextId = 1;

    constructor(unidadesIniciales: Unidad[] = []) {
        this.unidades = [...unidadesIniciales];
    }

    async guardar(unidad: Unidad): Promise<void> {
        // Verificar si ya existe (por nombre)
        const indice = this.unidades.findIndex(u => u.nombre === unidad.nombre);

        if (indice >= 0) {
            // Actualizar
            this.unidades[indice] = unidad;
        } else {
            // Agregar nueva
            this.unidades.push(unidad);
        }
    }

    async listar(): Promise<Unidad[]> {
        return [...this.unidades];
    }

    async borrarPorNombre(nombre: string): Promise<void> {
        this.unidades = this.unidades.filter(u => u.nombre !== nombre);
    }

    async borrarTodas(): Promise<void> {
        this.unidades = [];
    }

    async contar(): Promise<number> {
        return this.unidades.length;
    }

    async buscarPorNombre(nombre: string): Promise<Unidad | undefined> {
        return this.unidades.find(u => u.nombre === nombre);
    }

    async buscarPorPotenciaMinima(minimo: number): Promise<Unidad[]> {
        return this.unidades.filter(u => u.potenciaDeFuego >= minimo);
    }

    cargarDatosEjemplo(): void {
        const unidadesEjemplo: Unidad[] = [
            // CABALLERÍA
            new Unidad(4.5, 1.4, 0, 4200, "Transporte MX-7899"),
            new Unidad(7.3, 4.8, 9.8, 15600, "Tanque Sombras-VB98"),
            new Unidad(12, 0, 0, 1600, "Transporte rápido TAXIN-66"),

            // INFANTERÍA
            new Unidad(6, 0, 7, 250, "Infantería Básica"),
            new Unidad(4, 0, 10, 400, "Ametrallador"),
            new Unidad(7, 5, 0, 500, "Sanitario"),

            // ARTILLERÍA
            new Unidad(1, 0, 22, 1100, "Cañón Antiaéreo"),
            new Unidad(3, 2, 19, 1350, "Torpedero móvil"),
            new Unidad(0, 0, 14, 1100, "Cañón")
        ];

        this.unidades = [...unidadesEjemplo];
    }
}