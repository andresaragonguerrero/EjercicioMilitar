# ARQUITECTURA

## Ejército tiene 3 divisiones

- Artillería
- Caballería
- Infantería

## Clases

- Ejército:
  - división
  - fondo

- División:
  - unidad

- Unidad:
  - velocidad
  - blindaje
  - potenciaDeFuego
  - precio

## Interfaces base

- IDestructor:
  - capacidadDestruccion()

- IMovil:
  - capacidadDeMovimiento()

- IBlindado:
  - resistenciaAlAtaque()

## Servicios base

- calcularCapacidadMilitar: 𝐶𝑀 = (Pf * CM / 2 ) / (100 - Bl)

## Patrones de diseño

- Repository
- Factory Method para la creación de las unidades
- Singleton para los servicios
- Composite para la jerarquía del ejército: ejército, división, unidad
- Decorator para modificar las características de las unidades como el blindaje o la velocidad
- Adapter para convertir entre unidades de medida
- Strategy
