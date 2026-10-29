# Sistema de Gestión de Soporte Técnico

Aplicación web full stack para registrar, consultar, editar y eliminar tickets de soporte técnico, con persistencia real en base de datos.

**Evaluación N.° 2 – Electivo Angular – Instituto Profesional Virginio Gómez, Sede Chillán (Ingeniería en Informática)**

## Autor

- **Nombre:** Fabian Diaz
- **Asignatura:** Electivo Angular – Modalidad individual

## Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 22 (componentes standalone, Router, HttpClient, Reactive Forms, signals) |
| Backend | Node.js + Express 4 (API REST) |
| Base de datos | SQLite (módulo nativo `node:sqlite` de Node.js) |
| Pruebas | `node:test` (API) |

**¿Por qué SQLite?** Es una base de datos relacional equivalente a MySQL para este caso: persiste en un archivo (`backend/data/tickets.db`), usa SQL con consultas parametrizadas y no exige instalar ni configurar un servidor, por lo que el proyecto se ejecuta con solo clonar el repositorio. El esquema SQL (`backend/schema.sql`) es portable a MySQL cambiando tipos menores.

## Requisitos previos

- Node.js **22.5 o superior** (desarrollado con Node 26)
- npm
- Angular CLI 22 (`npm install -g @angular/cli`), opcional: también se puede usar `npx ng`

## Instalación

```bash
git clone https://github.com/Talisk1/soporte-tickets.git
cd soporte-tickets

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

La base de datos **se crea sola** al iniciar la API: el archivo `backend/schema.sql` se ejecuta automáticamente y genera `backend/data/tickets.db`. No requiere pasos manuales.

## Ejecución

Se necesitan dos terminales.

**Terminal 1 – API (puerto 3001):**

```bash
cd backend
npm start
```

**Terminal 2 – Frontend (puerto 4200):**

```bash
cd frontend
npm start
```

Abrir <http://localhost:4200>.

> Si cambia el puerto de la API, actualice `url` en `frontend/src/app/services/ticket.service.ts`.

## Estructura del proyecto

```
soporte-tickets/
├── backend/
│   ├── schema.sql              # Esquema de la base de datos
│   ├── data/                   # Archivo tickets.db (generado, no versionado)
│   └── src/
│       ├── server.js           # Arranque del servidor (puerto 3001)
│       ├── app.js              # Express: endpoints REST y manejo de errores
│       ├── db.js               # Conexión SQLite y creación del esquema
│       ├── validacion.js       # Validación de los datos del ticket
│       └── api.test.js         # Pruebas automáticas de la API
└── frontend/
    └── src/app/
        ├── models/ticket.ts            # Interfaz Ticket y listas de valores
        ├── services/ticket.service.ts  # Único punto de comunicación HTTP (HttpClient)
        ├── components/
        │   ├── ticket-list/            # Listado, eliminación con confirmación
        │   └── ticket-form/            # Formulario de creación y edición
        ├── app.routes.ts               # Rutas
        └── app.config.ts               # provideRouter + provideHttpClient
```

### API REST

| Método | Ruta | Descripción | Respuestas |
|--------|------|-------------|-----------|
| GET | `/api/tickets` | Lista todos los tickets (filtro opcional `?estado=`) | 200 |
| GET | `/api/tickets/:id` | Obtiene un ticket | 200, 400, 404 |
| POST | `/api/tickets` | Crea un ticket | 201, 400 |
| PUT | `/api/tickets/:id` | Actualiza un ticket | 200, 400, 404 |
| DELETE | `/api/tickets/:id` | Elimina un ticket | 204, 400, 404 |

### Modelo de datos (tabla `tickets`)

`id`, `asunto`, `solicitante`, `descripcion`, `categoria` (Hardware, Software, Red, Cuenta, Otro), `prioridad` (Baja, Media, Alta, Critica), `estado` (Abierto, En proceso, Resuelto, Cerrado), `fechaRegistro` (automática).

### Rutas del frontend

| Ruta | Vista |
|------|-------|
| `/tickets` | Listado de tickets |
| `/tickets/nuevo` | Formulario de registro |
| `/tickets/:id/editar` | Formulario de edición |

## Funcionalidades implementadas

- Listado de tickets leídos desde la base de datos.
- Registro de nuevos tickets mediante formulario.
- Edición de tickets con persistencia de cambios.
- Eliminación con confirmación previa.
- Distinción visual de **prioridad** y **estado** mediante etiquetas de color.
- Validación en el frontend (campos obligatorios, largos mínimos/máximos, selects) antes de enviar, y validación nuevamente en el backend.
- Mensajes de error al usuario (API caída, datos inválidos, ticket inexistente) con botón «Reintentar» en el listado.
- Consultas SQL parametrizadas (`?`) en todos los endpoints: no se concatenan datos del usuario.
- Persistencia tras recargar Angular y tras reiniciar la API.

## Pruebas realizadas

**Automáticas (backend):** `cd backend && npm test` → 4 pruebas: CRUD completo, rechazo de datos inválidos, intento de inyección SQL tratado como texto, id inexistente/inválido.

**Manuales (verificadas en el navegador):**

| Prueba | Resultado |
|--------|-----------|
| Inicio | API, frontend y BD arrancan siguiendo este README. ✔ |
| GET | El listado muestra los registros de la BD. ✔ |
| POST | Ticket creado en Angular aparece en el listado y en la BD. ✔ |
| PUT | Cubierta por la prueba automática del backend; falta verificarla desde Angular. |
| DELETE | Cubierta por la prueba automática del backend; falta verificarla desde Angular. |
| Validación | Formulario vacío muestra errores y no envía. ✔ |
| Error | Pendiente de verificar con la API detenida. |
| Persistencia | Pendiente de verificar reiniciando la API. |

## Declaración de uso de Inteligencia Artificial

- **Herramienta utilizada:** Claude (Anthropic), mediante Claude Code.
- **Actividades para las que se usó:** generación inicial del código del backend (Express, SQLite, validación, pruebas), de los componentes/servicio/rutas de Angular, los estilos y el borrador de este README.
- **Elementos con apoyo de IA:** código de `backend/src/*`, `frontend/src/app/*`, `styles.css`, documentación.
- **Modificaciones y verificaciones del estudiante:** _<describir: qué revisaste, qué cambiaste (p. ej. nombres, estilos, validaciones), qué probaste manualmente y qué errores corregiste>_.
