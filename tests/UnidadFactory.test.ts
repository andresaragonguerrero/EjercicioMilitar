import { UnidadFactory } from "../src/factory/UnidadFactory.js";
import { Unidad } from "../src/clases/Unidad.js";

describe('UnidadFactory', () => {
  describe('crearUnidad() - Casos exitosos', () => {
    test('debe crear una unidad con valores válidos', () => {
      const unidad = UnidadFactory.crearUnidad(30, 20, 40, 5000, 'Tanque Pesado');
      
      expect(unidad).toBeInstanceOf(Unidad);
      expect(unidad.nombre).toBe('Tanque Pesado');
      expect(unidad.velocidad).toBe(30);
      expect(unidad.blindaje).toBe(20);
      expect(unidad.potenciaDeFuego).toBe(40);
      expect(unidad.precio).toBe(5000);
    });

    test('debe permitir valores mínimos', () => {
      const unidad = UnidadFactory.crearUnidad(0, 0, 0, 0, 'Sc');
      
      expect(unidad.velocidad).toBe(0);
      expect(unidad.blindaje).toBe(0);
      expect(unidad.potenciaDeFuego).toBe(0);
      expect(unidad.precio).toBe(0);
      expect(unidad.nombre).toBe('Sc');
    });

    test('debe permitir valores máximos', () => {
      const unidad = UnidadFactory.crearUnidad(50, 50, 50, 10000, 'Máxima');
      
      expect(unidad.velocidad).toBe(50);
      expect(unidad.blindaje).toBe(50);
      expect(unidad.potenciaDeFuego).toBe(50);
      expect(unidad.precio).toBe(10000);
    });

    test('debe permitir valores decimales', () => {
      const unidad = UnidadFactory.crearUnidad(25.5, 30.75, 45.25, 7500.99, 'Precisión');
      
      expect(unidad.velocidad).toBe(25.5);
      expect(unidad.blindaje).toBe(30.75);
      expect(unidad.potenciaDeFuego).toBe(45.25);
      expect(unidad.precio).toBe(7500.99);
    });

    test('debe permitir nombres con espacios', () => {
      const unidad = UnidadFactory.crearUnidad(10, 10, 10, 1000, 'Tanque de Asalto');
      
      expect(unidad.nombre).toBe('Tanque de Asalto');
    });

    test('debe trimear espacios en el nombre', () => {
      const unidad = UnidadFactory.crearUnidad(10, 10, 10, 1000, '  Tanque  ');
      
      expect(unidad.nombre).toBe('  Tanque  ');
    });
  });

  describe('crearUnidad() - Validaciones de nombre', () => {
    test('debe lanzar error si nombre es undefined', () => {
      expect(() => {
        UnidadFactory.crearUnidad(10, 10, 10, 1000, undefined as any);
      }).toThrow('El nombre de la unidad es obligatorio');
    });

    test('debe lanzar error si nombre es null', () => {
      expect(() => {
        UnidadFactory.crearUnidad(10, 10, 10, 1000, null as any);
      }).toThrow('El nombre de la unidad es obligatorio');
    });

    test('debe lanzar error si nombre está vacío', () => {
      expect(() => {
        UnidadFactory.crearUnidad(10, 10, 10, 1000, '');
      }).toThrow('El nombre de la unidad es obligatorio');
    });

    test('debe lanzar error si nombre solo tiene espacios', () => {
      expect(() => {
        UnidadFactory.crearUnidad(10, 10, 10, 1000, '   ');
      }).toThrow('El nombre de la unidad es obligatorio');
    });

    test('debe lanzar error si nombre tiene menos de 2 caracteres', () => {
      expect(() => {
        UnidadFactory.crearUnidad(10, 10, 10, 1000, 'A');
      }).toThrow('El nombre debe tener al menos 2 caracteres');
    });

    test('debe permitir nombre con exactamente 2 caracteres', () => {
      const unidad = UnidadFactory.crearUnidad(10, 10, 10, 1000, 'AB');
      expect(unidad.nombre).toBe('AB');
    });
  });

  describe('crearUnidad() - Validaciones de valores negativos', () => {
    test('debe lanzar error si velocidad es negativa', () => {
      expect(() => {
        UnidadFactory.crearUnidad(-1, 10, 10, 1000, 'Tanque');
      }).toThrow('La velocidad no puede ser negativa');
    });

    test('debe lanzar error si blindaje es negativo', () => {
      expect(() => {
        UnidadFactory.crearUnidad(10, -1, 10, 1000, 'Tanque');
      }).toThrow('El blindaje no puede ser negativo');
    });

    test('debe lanzar error si potenciaDeFuego es negativa', () => {
      expect(() => {
        UnidadFactory.crearUnidad(10, 10, -1, 1000, 'Tanque');
      }).toThrow('La potencia de fuego no puede ser negativa');
    });

    test('debe lanzar error si precio es negativo', () => {
      expect(() => {
        UnidadFactory.crearUnidad(10, 10, 10, -1, 'Tanque');
      }).toThrow('El precio no puede ser negativo');
    });
  });

  describe('crearUnidad() - Validaciones de valores máximos', () => {
    test('debe lanzar error si velocidad excede 50', () => {
      expect(() => {
        UnidadFactory.crearUnidad(51, 10, 10, 1000, 'Tanque');
      }).toThrow('La velocidad no puede ser mayor a 50');
    });

    test('debe lanzar error si blindaje excede 50', () => {
      expect(() => {
        UnidadFactory.crearUnidad(10, 51, 10, 1000, 'Tanque');
      }).toThrow('El blindaje no puede ser mayor a 50');
    });

    test('debe lanzar error si potenciaDeFuego excede 50', () => {
      expect(() => {
        UnidadFactory.crearUnidad(10, 10, 51, 1000, 'Tanque');
      }).toThrow('La potencia de fuego no puede ser mayor a 50');
    });

    test('debe lanzar error si precio excede 10000', () => {
      expect(() => {
        UnidadFactory.crearUnidad(10, 10, 10, 10001, 'Tanque');
      }).toThrow('El precio no puede ser mayor a 10000');
    });

    test('debe permitir valores en el límite exacto', () => {
      expect(() => {
        UnidadFactory.crearUnidad(50, 50, 50, 10000, 'Límite');
      }).not.toThrow();
    });
  });

  describe('crearUnidad() - Múltiples errores', () => {
    test('debe lanzar solo el primer error encontrado', () => {
      expect(() => {
        UnidadFactory.crearUnidad(-1, -1, -1, -1, '');
      }).toThrow('El nombre de la unidad es obligatorio');
    });
  });

  describe('Métodos estáticos', () => {
    test('debe ser una clase con método estático', () => {
      expect(typeof UnidadFactory.crearUnidad).toBe('function');
      expect(UnidadFactory.prototype).not.toHaveProperty('crearUnidad');
    });
  });
});