import { Unidad } from '../src/clases/Unidad';

describe('Unidad', () => {
  describe('Constructor', () => {
    test('debe crear una unidad con los valores correctos', () => {
      const unidad = new Unidad(50, 30, 80, 1000, 'Tanque');
      
      expect(unidad.velocidad).toBe(50);
      expect(unidad.blindaje).toBe(30);
      expect(unidad.potenciaDeFuego).toBe(80);
      expect(unidad.precio).toBe(1000);
      expect(unidad.nombre).toBe('Tanque');
    });

    test('debe permitir crear unidad con valores mínimos', () => {
      const unidad = new Unidad(0, 0, 0, 0, 'Scout');
      
      expect(unidad.velocidad).toBe(0);
      expect(unidad.blindaje).toBe(0);
      expect(unidad.potenciaDeFuego).toBe(0);
      expect(unidad.precio).toBe(0);
    });
  });

  describe('Implementación de interfaces', () => {
    let unidad: Unidad;

    beforeEach(() => {
      unidad = new Unidad(60, 40, 70, 1500, 'Artillería');
    });

    test('debe implementar IMovil.capacidadDeMovimiento()', () => {
      expect(unidad.capacidadDeMovimiento()).toBe(60);
      expect(typeof unidad.capacidadDeMovimiento).toBe('function');
    });

    test('debe implementar IBlindado.resistenciaAlAtaque()', () => {
      expect(unidad.resistenciaAlAtaque()).toBe(40);
      expect(typeof unidad.resistenciaAlAtaque).toBe('function');
    });

    test('debe implementar IDestructor.capacidadDeDestruccion()', () => {
      expect(unidad.capacidadDeDestruccion()).toBe(70);
      expect(typeof unidad.capacidadDeDestruccion).toBe('function');
    });

    test('los métodos deben devolver los valores correctos', () => {
      unidad.velocidad = 75;
      unidad.blindaje = 25;
      unidad.potenciaDeFuego = 90;

      expect(unidad.capacidadDeMovimiento()).toBe(75);
      expect(unidad.resistenciaAlAtaque()).toBe(25);
      expect(unidad.capacidadDeDestruccion()).toBe(90);
    });
  });

  describe('Comportamiento de propiedades públicas', () => {
    test('las propiedades deben ser modificables', () => {
      const unidad = new Unidad(10, 20, 30, 400, 'Prueba');
      
      unidad.velocidad = 100;
      unidad.blindaje = 50;
      unidad.potenciaDeFuego = 80;
      unidad.precio = 2000;
      unidad.nombre = 'Actualizado';

      expect(unidad.velocidad).toBe(100);
      expect(unidad.blindaje).toBe(50);
      expect(unidad.potenciaDeFuego).toBe(80);
      expect(unidad.precio).toBe(2000);
      expect(unidad.nombre).toBe('Actualizado');
    });
  });

  describe('Casos especiales', () => {
    test('debe manejar valores decimales', () => {
      const unidad = new Unidad(12.5, 25.75, 33.33, 499.99, 'Precisión');
      
      expect(unidad.capacidadDeMovimiento()).toBeCloseTo(12.5);
      expect(unidad.resistenciaAlAtaque()).toBeCloseTo(25.75);
      expect(unidad.capacidadDeDestruccion()).toBeCloseTo(33.33);
    });

    test('debe mantener consistencia entre propiedades y métodos', () => {
      const unidad = new Unidad(42, 63, 84, 1050, 'Consistente');
      
      expect(unidad.capacidadDeMovimiento()).toBe(unidad.velocidad);
      expect(unidad.resistenciaAlAtaque()).toBe(unidad.blindaje);
      expect(unidad.capacidadDeDestruccion()).toBe(unidad.potenciaDeFuego);
    });
  });
});