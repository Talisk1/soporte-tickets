const express = require('express');
const cors = require('cors');
const db = require('./db');
const { validarTicket } = require('./validacion');

const app = express();
app.use(cors());
app.use(express.json());

// Valida que :id sea un entero positivo.
function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ mensaje: 'El id debe ser un entero positivo' });
    return null;
  }
  return id;
}

// GET /api/tickets -> listado (consulta parametrizada para el filtro opcional)
app.get('/api/tickets', (req, res) => {
  const estado = req.query.estado;
  const filas = estado
    ? db.prepare('SELECT * FROM tickets WHERE estado = ? ORDER BY id DESC').all(estado)
    : db.prepare('SELECT * FROM tickets ORDER BY id DESC').all();
  res.json(filas);
});

// GET /api/tickets/:id -> un ticket
app.get('/api/tickets/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const fila = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
  if (!fila) return res.status(404).json({ mensaje: 'Ticket no encontrado' });
  res.json(fila);
});

// POST /api/tickets -> crear
app.post('/api/tickets', (req, res) => {
  const { errores, datos } = validarTicket(req.body);
  if (errores.length) return res.status(400).json({ mensaje: 'Datos inválidos', errores });
  const r = db
    .prepare(
      'INSERT INTO tickets (asunto, solicitante, descripcion, categoria, prioridad, estado) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(datos.asunto, datos.solicitante, datos.descripcion, datos.categoria, datos.prioridad, datos.estado);
  const creado = db.prepare('SELECT * FROM tickets WHERE id = ?').get(r.lastInsertRowid);
  res.status(201).json(creado);
});

// PUT /api/tickets/:id -> actualizar
app.put('/api/tickets/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const { errores, datos } = validarTicket(req.body);
  if (errores.length) return res.status(400).json({ mensaje: 'Datos inválidos', errores });
  const r = db
    .prepare(
      'UPDATE tickets SET asunto = ?, solicitante = ?, descripcion = ?, categoria = ?, prioridad = ?, estado = ? WHERE id = ?'
    )
    .run(datos.asunto, datos.solicitante, datos.descripcion, datos.categoria, datos.prioridad, datos.estado, id);
  if (r.changes === 0) return res.status(404).json({ mensaje: 'Ticket no encontrado' });
  res.json(db.prepare('SELECT * FROM tickets WHERE id = ?').get(id));
});

// DELETE /api/tickets/:id -> eliminar
app.delete('/api/tickets/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const r = db.prepare('DELETE FROM tickets WHERE id = ?').run(id);
  if (r.changes === 0) return res.status(404).json({ mensaje: 'Ticket no encontrado' });
  res.status(204).end();
});

// Ruta inexistente
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));

// Errores no controlados (incluye JSON mal formado)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ mensaje: 'JSON mal formado' });
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

module.exports = app;
