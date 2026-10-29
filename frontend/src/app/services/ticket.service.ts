import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket, TicketInput } from '../models/ticket';

// Centraliza toda la comunicación HTTP con la API REST.
@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3001/api/tickets';

  listar(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.url);
  }

  obtener(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.url}/${id}`);
  }

  crear(ticket: TicketInput): Observable<Ticket> {
    return this.http.post<Ticket>(this.url, ticket);
  }

  actualizar(id: number, ticket: TicketInput): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.url}/${id}`, ticket);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

// Convierte un error HTTP en un mensaje legible para el usuario.
export function mensajeDeError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'No se pudo conectar con el servidor. Verifique que la API esté en ejecución.';
    const cuerpo = err.error as { mensaje?: string; errores?: string[] } | null;
    if (cuerpo?.errores?.length) return `${cuerpo.mensaje}: ${cuerpo.errores.join('; ')}`;
    if (cuerpo?.mensaje) return cuerpo.mensaje;
    return `Error ${err.status}: ${err.statusText}`;
  }
  return 'Ocurrió un error inesperado.';
}
