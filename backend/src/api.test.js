// Pruebas automáticas de la API: `npm test` (usa una BD en memoria).
process.env.DB_PATH = ':memory:';
const test = require('node:test');
const assert = require('node:assert');
const app = require('./app');

let server, base;
test.before(() => new Promise((ok) => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }));
test.after(() => server.close());

const valido = { asunto: 'No imprime', solicitante: 'Ana Pérez', descripcion: 'La impresora del piso 2 no responde', categoria: 'Hardware', prioridad: 'Alta' };
const json = (method, url, body) => fetch(base + url, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });

test('CRUD completo', async () => {
  let r = await json('POST', '/api/tickets', valido);
  assert.equal(r.status, 201);
  const t = await r.json();
  assert.equal(t.estado, 'Abierto');

  r = await fetch(base + '/api/tickets');
  assert.equal((await r.json()).length, 1);

  r = await json('PUT', `/api/tickets/${t.id}`, { ...valido, estado: 'Resuelto' });
  assert.equal((await r.json()).estado, 'Resuelto');

  r = await fetch(base + `/api/tickets/${t.id}`);
  assert.equal((await r.json()).estado, 'Resuelto');

  r = await json('DELETE', `/api/tickets/${t.id}`);
  assert.equal(r.status, 204);
  r = await fetch(base + `/api/tickets/${t.id}`);
  assert.equal(r.status, 404);
});

test('validación rechaza datos inválidos', async () => {
  const r = await json('POST', '/api/tickets', { ...valido, asunto: '', prioridad: 'X' });
  assert.equal(r.status, 400);
  assert.ok((await r.json()).errores.length >= 2);
});

test('inyección SQL se trata como texto', async () => {
  const r = await json('POST', '/api/tickets', { ...valido, asunto: "x'); DROP TABLE tickets;--" });
  assert.equal(r.status, 201);
  assert.equal((await (await fetch(base + '/api/tickets')).json()).length, 1);
});

test('id inexistente o inválido', async () => {
  assert.equal((await json('DELETE', '/api/tickets/9999')).status, 404);
  assert.equal((await fetch(base + '/api/tickets/abc')).status, 400);
});
