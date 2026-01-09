import { EjercitoService } from '../src/servicios/EjercitoService.js';
import { EjercitoFactory } from '../src/factory/EjercitoFactory.js';
import { Ejercito } from '../src/clases/Ejercito.js';
import { Unidad } from '../src/clases/Unidad.js';

const mockEjercitoRepository = {
    guardar: jest.fn(),
    listar: jest.fn(),
    borrarPorNombre: jest.fn(),
    borrarTodos: jest.fn(),
};

describe('EjercitoService', () => {
    let servicio: EjercitoService;

    beforeEach(() => {
        jest.clearAllMocks();
        servicio = new EjercitoService(mockEjercitoRepository);
    });

    describe('Constructor', () => {
        test('debe crear instancia con repositorio proporcionado', () => {
            expect(servicio).toBeInstanceOf(EjercitoService);
        });

        test('debe crear repositorio por defecto si no se proporciona', () => {
            const servicioConDefault = new EjercitoService();
            expect(servicioConDefault).toBeInstanceOf(EjercitoService);
        });
    });

    describe('crearEjercito()', () => {
        test('debe crear y guardar un ejército válido', async () => {
            const nombre = 'Legión Imperial';
            const fondo = 50000;
            const ejercitoMock = EjercitoFactory.crearEjercito(nombre, fondo);

            mockEjercitoRepository.guardar.mockResolvedValue(undefined);

            const resultado = await servicio.crearEjercito(nombre, fondo);

            expect(mockEjercitoRepository.guardar).toHaveBeenCalledTimes(1);
            expect(mockEjercitoRepository.guardar).toHaveBeenCalledWith(
                expect.objectContaining({ nombre, fondo })
            );
            expect(resultado).toBeInstanceOf(Ejercito);
            expect(resultado.nombre).toBe(nombre);
            expect(resultado.fondo).toBe(fondo);
        });

        test('debe propagar error de EjercitoFactory', async () => {
            await expect(servicio.crearEjercito('', 10000))
                .rejects
                .toThrow('El nombre del ejército es obligatorio');

            expect(mockEjercitoRepository.guardar).not.toHaveBeenCalled();
        });

        test('debe propagar error del repositorio', async () => {
            mockEjercitoRepository.guardar.mockRejectedValue(new Error('Error de BD'));

            await expect(servicio.crearEjercito('Test', 10000))
                .rejects
                .toThrow('Error de BD');
        });
    });

    describe('listarEjercitos()', () => {
        test('debe devolver lista de ejércitos del repositorio', async () => {
            const ejercitosMock = [
                new Ejercito('Ejército 1', 10000),
                new Ejercito('Ejército 2', 20000),
            ];

            mockEjercitoRepository.listar.mockResolvedValue(ejercitosMock);

            const resultado = await servicio.listarEjercitos();

            expect(mockEjercitoRepository.listar).toHaveBeenCalledTimes(1);
            expect(resultado).toBe(ejercitosMock);
            expect(resultado.length).toBe(2);
        });

        test('debe devolver array vacío si no hay ejércitos', async () => {
            mockEjercitoRepository.listar.mockResolvedValue([]);

            const resultado = await servicio.listarEjercitos();

            expect(resultado).toEqual([]);
        });
    });

    describe('borrarEjercito()', () => {
        test('debe borrar ejército por nombre', async () => {
            const nombre = 'Ejército a Borrar';
            mockEjercitoRepository.borrarPorNombre.mockResolvedValue(undefined);

            await servicio.borrarEjercito(nombre);

            expect(mockEjercitoRepository.borrarPorNombre).toHaveBeenCalledTimes(1);
            expect(mockEjercitoRepository.borrarPorNombre).toHaveBeenCalledWith(nombre);
        });

        test('debe propagar error del repositorio', async () => {
            mockEjercitoRepository.borrarPorNombre.mockRejectedValue(new Error('No encontrado'));

            await expect(servicio.borrarEjercito('Inexistente'))
                .rejects
                .toThrow('No encontrado');
        });
    });

    describe('borrarTodosEjercitos()', () => {
        test('debe borrar todos los ejércitos', async () => {
            mockEjercitoRepository.borrarTodos.mockResolvedValue(undefined);

            await servicio.borrarTodosEjercitos();

            expect(mockEjercitoRepository.borrarTodos).toHaveBeenCalledTimes(1);
        });
    });

    describe('agregarUnidadAEjercito()', () => {
        let ejercitoExistente: Ejercito;
        let unidad: Unidad;

        beforeEach(() => {
            ejercitoExistente = new Ejercito('Ejército Existente', 10000);
            unidad = new Unidad(10, 20, 30, 2000, 'Nueva Unidad');

            mockEjercitoRepository.listar.mockResolvedValue([ejercitoExistente]);
            mockEjercitoRepository.guardar.mockResolvedValue(undefined);
        });

        test('debe agregar unidad a ejército existente', async () => {
            await servicio.agregarUnidadAEjercito('Ejército Existente', 'Artillería', unidad);

            expect(mockEjercitoRepository.listar).toHaveBeenCalledTimes(1);
            expect(mockEjercitoRepository.guardar).toHaveBeenCalledTimes(1);
            expect(mockEjercitoRepository.guardar).toHaveBeenCalledWith(
                expect.objectContaining({
                    nombre: 'Ejército Existente',
                    fondo: 10000,
                })
            );
        });

        test('debe crear división si no existe', async () => {
            await servicio.agregarUnidadAEjercito('Ejército Existente', 'NuevaDivisión', unidad);

            const ejercitoGuardado = mockEjercitoRepository.guardar.mock.calls[0][0];
            expect(ejercitoGuardado.getDivisiones().length).toBe(1);
            expect(ejercitoGuardado.getDivisiones()[0].nombre).toBe('NuevaDivisión');
        });

        test('debe lanzar error si ejército no existe', async () => {
            mockEjercitoRepository.listar.mockResolvedValue([]);

            await expect(
                servicio.agregarUnidadAEjercito('Inexistente', 'Artillería', unidad)
            ).rejects.toThrow('Ejército Inexistente no existe');
        });

        test('debe validar fondos insuficientes', async () => {
            const ejercitoCasiSinFondo = new Ejercito('Pobre', 10000);
            const division = ejercitoCasiSinFondo.getOrCrearDivision('Test');
            division.agregarUnidad(new Unidad(10, 10, 10, 8000, 'Cara'));

            mockEjercitoRepository.listar.mockResolvedValue([ejercitoCasiSinFondo]);

            const unidadCara = new Unidad(10, 10, 10, 3000, 'Muy Cara');

            await expect(
                servicio.agregarUnidadAEjercito('Pobre', 'Test', unidadCara)
            ).rejects.toThrow('Fondos insuficientes');
        });

        test('debe permitir agregar unidad si hay fondos exactos', async () => {
            const ejercitoExacto = new Ejercito('Exacto', 5000);
            mockEjercitoRepository.listar.mockResolvedValue([ejercitoExacto]);

            const unidadExacta = new Unidad(10, 10, 10, 5000, 'Exacta');

            await expect(
                servicio.agregarUnidadAEjercito('Exacto', 'Test', unidadExacta)
            ).resolves.not.toThrow();
        });

        test('debe actualizar el gasto total después de agregar unidad', async () => {
            await servicio.agregarUnidadAEjercito('Ejército Existente', 'Artillería', unidad);

            const ejercitoGuardado = mockEjercitoRepository.guardar.mock.calls[0][0];
            expect(ejercitoGuardado.dineroGastado()).toBe(2000);
        });
    });

    describe('Implementación de interfaz', () => {
        test('debe implementar todos los métodos de IEjercitoService', () => {
            expect(typeof servicio.crearEjercito).toBe('function');
            expect(typeof servicio.listarEjercitos).toBe('function');
            expect(typeof servicio.borrarEjercito).toBe('function');
            expect(typeof servicio.borrarTodosEjercitos).toBe('function');
            expect(typeof servicio.agregarUnidadAEjercito).toBe('function');
        });
    });

    describe('Integración con Ejercito.fromPlainObject', () => {
        test('debe reconstruir Ejercito desde objeto plano', async () => {
            const ejercitoPlano = {
                nombre: 'Ejército Plano',
                fondo: 15000,
                divisiones: [
                    {
                        nombre: 'Existente',
                        unidades: [
                            { velocidad: 10, blindaje: 10, potenciaDeFuego: 10, precio: 1000, nombre: 'Vieja' }
                        ]
                    }
                ]
            };

            mockEjercitoRepository.listar.mockResolvedValue([ejercitoPlano]);

            const unidadNueva = new Unidad(20, 20, 20, 2000, 'Nueva');
            await servicio.agregarUnidadAEjercito('Ejército Plano', 'Existente', unidadNueva);

            const ejercitoGuardado = mockEjercitoRepository.guardar.mock.calls[0][0];
            expect(ejercitoGuardado).toBeInstanceOf(Ejercito);
            expect(ejercitoGuardado.nombre).toBe('Ejército Plano');
            expect(ejercitoGuardado.cantidadTotalDeUnidades()).toBe(2);
        });
    });
});