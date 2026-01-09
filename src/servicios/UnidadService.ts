import { Unidad } from "../clases/Unidad.js";
import { IUnidadRepository } from "../interfaces/IUnidadRepository.js";
import { UnidadFactory } from "../factory/UnidadFactory.js";
import { IUnidadService } from "../interfaces/IUnidadService.js";

export class UnidadService implements IUnidadService {
    private readonly unidadRepo: IUnidadRepository;

    constructor(unidadRepo: IUnidadRepository) {
        this.unidadRepo = unidadRepo;
    }

    async crearUnidad(
        velocidad: number,
        blindaje: number,
        potenciaDeFuego: number,
        precio: number,
        nombre: string
    ): Promise<Unidad> {
        const unidad = UnidadFactory.crearUnidad(velocidad, blindaje, potenciaDeFuego, precio, nombre);
        return unidad;
    }

    async listarUnidades(): Promise<Unidad[]> {
        return await this.unidadRepo.listar();
    }

    async guardarUnidad(unidad: Unidad): Promise<void> {
        await this.unidadRepo.guardar(unidad);
    }

    async borrarUnidad(nombre: string): Promise<void> {
        await this.unidadRepo.borrarPorNombre(nombre);
    }

    async borrarTodasUnidades(): Promise<void> {
        await this.unidadRepo.borrarTodas();
    }
}