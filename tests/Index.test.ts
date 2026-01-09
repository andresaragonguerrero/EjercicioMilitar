import { Ejercito } from "../src/clases/Ejercito";
import { UnidadService } from "../src/servicios/UnidadService";
import { EjercitoService } from "../src/servicios/EjercitoService";
import { ServicioCapacidadMilitar } from "../src/servicios/CapacidadMilitarService";

const mockUnidadRepo = {
  guardar: jest.fn(),
  listar: jest.fn().mockResolvedValue([]),
  borrarPorNombre: jest.fn(),
  borrarTodas: jest.fn(),
};

const mockEjercitoRepo = {
  guardar: jest.fn(),
  listar: jest.fn().mockResolvedValue([]),
  borrarPorNombre: jest.fn(),
  borrarTodos: jest.fn(),
};

describe('Integración - Flujo principal', () => {
  let unidadService: UnidadService;
  let ejercitoService: EjercitoService;
  let servicioCM: ServicioCapacidadMilitar;

  beforeEach(() => {
    jest.clearAllMocks();

    unidadService = new UnidadService(mockUnidadRepo);
    ejercitoService = new EjercitoService(mockEjercitoRepo);
    servicioCM = new ServicioCapacidadMilitar();
  });

  describe('Flujo crear ejército → crear unidad → generar informe', () => {
    test('debe permitir flujo básico sin errores', async () => {
      mockEjercitoRepo.listar.mockResolvedValue([]);
      mockEjercitoRepo.guardar.mockResolvedValue(undefined);

      await expect(
        ejercitoService.crearEjercito('Ejército Test', 10000)
      ).resolves.toBeInstanceOf(Ejercito);

      expect(mockEjercitoRepo.guardar).toHaveBeenCalledTimes(1);
    });
  });

  describe('Manejo de errores', () => {
    test('debe manejar error al crear ejército con nombre inválido', async () => {
      await expect(ejercitoService.crearEjercito('', 10000))
        .rejects
        .toThrow('El nombre del ejército es obligatorio');
    });

    test('debe manejar error al agregar unidad a ejército inexistente', async () => {
      mockEjercitoRepo.listar.mockResolvedValue([]);

      await expect(
        ejercitoService.agregarUnidadAEjercito(
          'Inexistente',
          'Artillería',
          { nombre: 'Test' } as any
        )
      ).rejects.toThrow('Ejército Inexistente no existe');
    });
  });
});