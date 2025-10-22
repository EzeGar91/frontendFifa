# Dashboard de Jugadores - Frontend

Este proyecto Angular implementa un dashboard completo para buscar y filtrar jugadores con las siguientes funcionalidades:

## Características

- **Motor de búsqueda avanzado**: Filtra jugadores por nombre, club y posición
- **Interfaz moderna y responsive**: Diseño atractivo con tarjetas de jugadores
- **Descarga CSV**: Exporta los resultados filtrados en formato CSV
- **Búsqueda en tiempo real**: Los filtros se aplican automáticamente mientras escribes
- **Estadísticas**: Muestra el número total de jugadores y resultados encontrados

## Estructura del Proyecto

```
app/
├── dashboard/
│   ├── dashboard.component.ts      # Lógica del dashboard
│   ├── dashboard.component.html    # Template del dashboard
│   ├── dashboard.component.scss    # Estilos del dashboard
│   └── dashboard.component.spec.ts # Tests del componente
├── models/
│   └── player.model.ts            # Interfaz del modelo Player
├── services/
│   └── player.service.ts          # Servicio para comunicación con API
└── players/
    ├── players.components.ts      # Componente de gestión de jugadores
    └── players.component.html     # Template de gestión de jugadores
```

## Modelo de Datos

El modelo `Player` incluye los siguientes campos:

```typescript
interface Player {
  id?: number;
  name: string;
  age: number;
  nationality: string;
  club: string;
  position: string;  // Nuevo campo agregado
  overall: number;
}
```

## Endpoints del Backend Requeridos

Para que el dashboard funcione correctamente, el backend debe implementar los siguientes endpoints:

### 1. Obtener todos los jugadores
```
GET /api/players
```

### 2. Buscar jugadores con filtros
```
GET /api/players/search?name={nombre}&club={club}&position={posicion}
```

**Parámetros de consulta opcionales:**
- `name`: Nombre del jugador (búsqueda parcial)
- `club`: Nombre del club (búsqueda parcial)
- `position`: Posición exacta del jugador

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "name": "Lionel Messi",
    "age": 36,
    "nationality": "Argentina",
    "club": "Inter Miami",
    "position": "Delantero",
    "overall": 95
  }
]
```

### 3. Exportar jugadores a CSV
```
GET /api/players/export?name={nombre}&club={club}&position={posicion}
```

**Respuesta esperada:**
- Content-Type: `text/csv`
- Archivo CSV con headers: `id,name,age,nationality,club,position,overall`

### 4. CRUD básico (ya implementado)
```
POST /api/players          # Crear jugador
PUT /api/players/{id}      # Actualizar jugador
DELETE /api/players/{id}   # Eliminar jugador
```

## Posiciones Disponibles

El sistema incluye las siguientes posiciones de jugadores:

- Portero
- Defensor
- Mediocampista
- Delantero
- Lateral Derecho
- Lateral Izquierdo
- Central
- Volante
- Extremo
- Centro delantero

## Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm start
   ```

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

## Configuración del Backend

Asegúrate de que tu backend esté ejecutándose en `http://localhost:3000` y que implemente los endpoints mencionados anteriormente.

## Características de la UI

- **Diseño responsive**: Se adapta a diferentes tamaños de pantalla
- **Búsqueda en tiempo real**: Los resultados se actualizan automáticamente
- **Indicadores visuales**: Loading spinner durante las búsquedas
- **Badges de posición**: Colores distintivos para cada posición
- **Tarjetas de jugadores**: Diseño moderno con información clara
- **Botones de acción**: Limpiar filtros y descargar CSV

## Navegación

- `/dashboard` - Dashboard principal con motor de búsqueda
- `/players` - Gestión de jugadores (CRUD)
- `/` - Redirige automáticamente al dashboard

## Tecnologías Utilizadas

- Angular 20
- TypeScript
- Reactive Forms
- HTTP Client
- SCSS para estilos
- Responsive Design
