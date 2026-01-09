import { UnidadService } from '../src/servicios/UnidadService.js';
import { UnidadFactory } from '../src/factory/UnidadFactory.js';
import { Unidad } from '../src/clases/Unidad.js';

const mockUnidadRepository = {
    guardar: jest.fn(),
    listar: jest.fn(),
    borrarPorNombre: jest.fn(),
    borrarTodas: jest.fn(),
};

describe('UnidadService', () => {
    let servicio: UnidadService;

    beforeEach(() => {
        jest.clearAllMocks();
        servicio = new UnidadService(mockUnidadRepository);
        jest.restoreAllMocks();
    });

    describe('Constructor', () => {
        test('debe crear instancia con repositorio inyectado', () => {
            expect(servicio).toBeInstanceOf(UnidadService);
        });

        test('debe aceptar cualquier repositorio (validación en uso)', () => {
            const servicioConUndefined = new UnidadService(undefined as any);
            expect(servicioConUndefined).toBeInstanceOf(UnidadService);
        });
    });

    describe('crearUnidad()', () => {
        test('debe crear unidad usando UnidadFactory', async () => {
            const unidadMock = new Unidad(30, 20, 40, 5000, 'Tanque');
            const spy = jest.spyOn(UnidadFactory, 'crearUnidad').mockReturnValue(unidadMock);

            const resultado = await servicio.crearUnidad(30, 20, 40, 5000, 'Tanque');

            expect(UnidadFactory.crearUnidad).toHaveBeenCalledWith(30, 20, 40, 5000, 'Tanque');
            expect(resultado).toBe(unidadMock);
            expect(resultado).toBeInstanceOf(Unidad);

            spy.mockRestore();
        });

        test('debe propagar error de UnidadFactory', async () => {
            const spy = jest.spyOn(UnidadFactory, 'crearUnidad').mockImplementation(() => {
                throw new Error('Nombre inválido');
            });

            await expect(
                servicio.crearUnidad(10, 10, 10, 1000, '')
            ).rejects.toThrow('Nombre inválido');

            spy.mockRestore();
        });

        test('debe crear unidad con valores válidos', async () => {
            const resultado = await servicio.crearUnidad(25, 15, 35, 3000, 'Artillería');

            expect(resultado).toBeInstanceOf(Unidad);
            expect(resultado.nombre).toBe('Artillería');
            expect(resultado.velocidad).toBe(25);
            expect(resultado.blindaje).toBe(15);
            expect(resultado.potenciaDeFuego).toBe(35);
            expect(resultado.precio).toBe(3000);
        });
    });

    describe('listarUnidades()', () => {
        test('debe devolver lista de unidades del repositorio', async () => {
            const unidadesMock = [
                new Unidad(10, 10, 10, 1000, 'U1'),
                new Unidad(20, 20, 20, 2000, 'U2'),
            ];

            mockUnidadRepository.listar.mockResolvedValue(unidadesMock);

            const resultado = await servicio.listarUnidades();

            expect(mockUnidadRepository.listar).toHaveBeenCalledTimes(1);
            expect(resultado).toBe(unidadesMock);
            expect(resultado.length).toBe(2);
        });

        test('debe devolver array vacío si no hay unidades', async () => {
            mockUnidadRepository.listar.mockResolvedValue([]);

            const resultado = await servicio.listarUnidades();

            expect(resultado).toEqual([]);
        });

        test('debe propagar error del repositorio', async () => {
            mockUnidadRepository.listar.mockRejectedValue(new Error('Error de BD'));

            await expect(servicio.listarUnidades()).rejects.toThrow('Error de BD');
        });
    });

    describe('guardarUnidad()', () => {
        test('debe guardar unidad en repositorio', async () => {
            const unidad = new Unidad(10, 20, 30, 4000, 'GuardarTest');
            mockUnidadRepository.guardar.mockResolvedValue(undefined);

            await servicio.guardarUnidad(unidad);

            expect(mockUnidadRepository.guardar).toHaveBeenCalledTimes(1);
            expect(mockUnidadRepository.guardar).toHaveBeenCalledWith(unidad);
        });

        test('debe propagar error del repositorio', async () => {
            const unidad = new Unidad(10, 10, 10, 1000, 'Test');
            mockUnidadRepository.guardar.mockRejectedValue(new Error('Error guardando'));

            await expect(servicio.guardarUnidad(unidad)).rejects.toThrow('Error guardando');
        });
    });

    describe('borrarUnidad()', () => {
        test('debe borrar unidad por nombre', async () => {
            const nombre = 'Unidad a Borrar';
            mockUnidadRepository.borrarPorNombre.mockResolvedValue(undefined);

            await servicio.borrarUnidad(nombre);

            expect(mockUnidadRepository.borrarPorNombre).toHaveBeenCalledTimes(1);
            expect(mockUnidadRepository.borrarPorNombre).toHaveBeenCalledWith(nombre);
        });

        test('debe propagar error del repositorio', async () => {
            mockUnidadRepository.borrarPorNombre.mockRejectedValue(new Error('No encontrada'));

            await expect(servicio.borrarUnidad('Inexistente')).rejects.toThrow('No encontrada');
        });

        test('debe manejar nombres con espacios', async () => {
            const nombre = 'Unidad con espacios';
            mockUnidadRepository.borrarPorNombre.mockResolvedValue(undefined);

            await servicio.borrarUnidad(nombre);

            expect(mockUnidadRepository.borrarPorNombre).toHaveBeenCalledWith('Unidad con espacios');
        });
    });

    describe('borrarTodasUnidades()', () => {
        test('debe borrar todas las unidades', async () => {
            mockUnidadRepository.borrarTodas.mockResolvedValue(undefined);

            await servicio.borrarTodasUnidades();

            expect(mockUnidadRepository.borrarTodas).toHaveBeenCalledTimes(1);
        });

        test('debe propagar error del repositorio', async () => {
            mockUnidadRepository.borrarTodas.mockRejectedValue(new Error('Error borrando'));

            await expect(servicio.borrarTodasUnidades()).rejects.toThrow('Error borrando');
        });
    });

    describe('Flujo completo', () => {
        test('debe permitir crear, guardar y listar unidad', async () => {
            // 1. Crear unidad
            const unidad = await servicio.crearUnidad(15, 25, 35, 4500, 'FlujoCompleto');

            // 2. Guardar unidad
            mockUnidadRepository.guardar.mockResolvedValue(undefined);
            await servicio.guardarUnidad(unidad);

            // 3. Listar unidades
            mockUnidadRepository.listar.mockResolvedValue([unidad]);
            const unidades = await servicio.listarUnidades();

            // Verificaciones
            expect(unidad).toBeInstanceOf(Unidad);
            expect(mockUnidadRepository.guardar).toHaveBeenCalledWith(unidad);
            expect(unidades).toContain(unidad);
            expect(unidades.length).toBe(1);
        });

        test('debe permitir crear, guardar y luego borrar unidad', async () => {
            // Crear y guardar
            const unidad = await servicio.crearUnidad(10, 20, 30, 4000, 'ParaBorrar');
            mockUnidadRepository.guardar.mockResolvedValue(undefined);
            await servicio.guardarUnidad(unidad);

            // Borrar
            mockUnidadRepository.borrarPorNombre.mockResolvedValue(undefined);
            await servicio.borrarUnidad('ParaBorrar');

            expect(mockUnidadRepository.borrarPorNombre).toHaveBeenCalledWith('ParaBorrar');
        });
    });

    describe('Implementación de interfaz', () => {
        test('debe implementar todos los métodos de IUnidadService', () => {
            expect(typeof servicio.crearUnidad).toBe('function');
            expect(typeof servicio.listarUnidades).toBe('function');
            expect(typeof servicio.guardarUnidad).toBe('function');
            expect(typeof servicio.borrarUnidad).toBe('function');
            expect(typeof servicio.borrarTodasUnidades).toBe('function');
        });
    });

    describe('Validaciones implícitas', () => {
        test('no valida nombre duplicado al crear (responsabilidad del repositorio)', async () => {
            const unidad1 = await servicio.crearUnidad(10, 10, 10, 1000, 'Duplicado');
            const unidad2 = await servicio.crearUnidad(20, 20, 20, 2000, 'Duplicado');

            expect(unidad1.nombre).toBe('Duplicado');
            expect(unidad2.nombre).toBe('Duplicado');
        });
    });
});