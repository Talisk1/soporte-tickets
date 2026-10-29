export const CATEGORIAS = ['Hardware', 'Software', 'Red', 'Cuenta', 'Otro'] as const;
export const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Critica'] as const;
export const ESTADOS = ['Abierto', 'En proceso', 'Resuelto', 'Cerrado'] as const;

export interface Ticket {
  id: number;
  asunto: string;
  solicitante: string;
  descripcion: string;
  categoria: (typeof CATEGORIAS)[number];
  prioridad: (typeof PRIORIDADES)[number];
  estado: (typeof ESTADOS)[number];
  fechaRegistro: string;
}

// Lo que se envía a la API al crear o editar (sin id ni fecha).
export type TicketInput = Omit<Ticket, 'id' | 'fechaRegistro'>;
