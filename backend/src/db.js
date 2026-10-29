const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

// Ruta del archivo de BD; se puede cambiar con DB_PATH (los tests usan ':memory:').
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'tickets.db');
if (dbPath !== ':memory:') fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec(fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8'));

module.exports = db;
