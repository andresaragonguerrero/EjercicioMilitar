import { Ejercito } from "../clases/Ejercito.js";
import { Unidad } from "../clases/Unidad.js";
import { EjercitoFactory } from "../factory/EjercitoFactory.js";
import { EjercitoIndexedDBRepository } from "../repositories/EjercitoIndexedDBRepository.js";
import { IEjercitoRepository } from "../interfaces/IEjercitoRepository.js";
import { IEjercitoService } from "../interfaces/IEjercitoService.js";

export class EjercitoService implements IEjercitoService {
    private readonly ejercitoRepo: IEjercitoRepository;

    constructor(ejercitoRepo?: IEjercitoRepository) {
        this.ejercitoRepo = ejercitoRepo || new EjercitoIndexedDBRepository();
    }

    async crearEjercito(nombre: string, fondo: number): Promise<Ejercito> {
        const ejercito = EjercitoFactory.crearEjercito(nombre, fondo);
        await this.ejercitoRepo.guardar(ejercito);
        return ejercito;
    }

    async listarEjercitos(): Promise<Ejercito[]> {
        return await this.ejercitoRepo.listar();
    }

    async borrarEjercito(nombre: string): Promise<void> {
        await this.ejercitoRepo.borrarPorNombre(nombre);
    }

    async borrarTodosEjercitos(): Promise<void> {
        await this.ejercitoRepo.borrarTodos();
    }

    async agregarUnidadAEjercito(
        ejercitoNombre: string,
        divisionNombre: string,
        unidad: Unidad
    ): Promise<void> {
        const ejercitos = await this.ejercitoRepo.listar();

        const ejercitoPlano = ejercitos.find(e => e.nombre === ejercitoNombre);

        if (!ejercitoPlano) {
            throw new Error(`Ejército ${ejercitoNombre} no existe`);
        }

        const ejercito = Ejercito.fromPlainObject(ejercitoPlano);

        const gastoActual = ejercito.dineroGastado();
        const costoNuevaUnidad = unidad.precio;
        const gastoTotal = gastoActual + costoNuevaUnidad;

        if (gastoTotal > ejercito.fondo) {
            throw new Error(
                `Fondos insuficientes en el ejército ${ejercitoNombre}. ` +
                    `Fondos actuales: ${ejercito.fondo}, ` +
                    `Gasto actual: ${gastoActual}, ` +
                    `Costo nueva unidad: ${costoNuevaUnidad}, ` +
                    `Gasto total: ${gastoTotal}`
            );
        }

        const division = ejercito.getOrCrearDivision(divisionNombre);
        division.agregarUnidad(unidad);

        await this.ejercitoRepo.guardar(ejercito);
    }
}
