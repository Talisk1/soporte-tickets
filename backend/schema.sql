-- Esquema de la base de datos (SQLite). Se aplica automaticamente al iniciar la API.
CREATE TABLE IF NOT EXISTS tickets (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  asunto        TEXT NOT NULL,
  solicitante   TEXT NOT NULL,
  descripcion   TEXT NOT NULL,
  categoria     TEXT NOT NULL CHECK (categoria IN ('Hardware','Software','Red','Cuenta','Otro')),
  prioridad     TEXT NOT NULL CHECK (prioridad IN ('Baja','Media','Alta','Critica')),
  estado        TEXT NOT NULL DEFAULT 'Abierto' CHECK (estado IN ('Abierto','En proceso','Resuelto','Cerrado')),
  fechaRegistro TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
