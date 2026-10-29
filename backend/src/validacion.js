const CATEGORIAS = ['Hardware', 'Software', 'Red', 'Cuenta', 'Otro'];
const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Critica'];
const ESTADOS = ['Abierto', 'En proceso', 'Resuelto', 'Cerrado'];

// Valida el cuerpo de un ticket. Devuelve { errores, datos }.
function validarTicket(body) {
  const b = body || {};
  const errores = [];
  const texto = (v) => (typeof v === 'string' ? v.trim() : '');

  const datos = {
    asunto: texto(b.asunto),
    solicitante: texto(b.solicitante),
    descripcion: texto(b.descripcion),
    categoria: b.categoria,
    prioridad: b.prioridad,
    estado: b.estado ?? 'Abierto',
  };

  if (datos.asunto.length < 3 || datos.asunto.length > 120) errores.push('asunto: entre 3 y 120 caracteres');
  if (datos.solicitante.length < 3 || datos.solicitante.length > 80) errores.push('solicitante: entre 3 y 80 caracteres');
  if (datos.descripcion.length < 10 || datos.descripcion.length > 1000) errores.push('descripcion: entre 10 y 1000 caracteres');
  if (!CATEGORIAS.includes(datos.categoria)) errores.push(`categoria: debe ser una de ${CATEGORIAS.join(', ')}`);
  if (!PRIORIDADES.includes(datos.prioridad)) errores.push(`prioridad: debe ser una de ${PRIORIDADES.join(', ')}`);
  if (!ESTADOS.includes(datos.estado)) errores.push(`estado: debe ser uno de ${ESTADOS.join(', ')}`);

  return { errores, datos };
}

module.exports = { validarTicket };
