import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ticket } from '../../models/ticket';
import { TicketService, mensajeDeError } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  imports: [RouterLink],
  templateUrl: './ticket-list.html',
})
export class TicketList implements OnInit {
  private readonly servicio = inject(TicketService);

  protected readonly tickets = signal<Ticket[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal('');
  protected readonly exito = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.servicio.listar().subscribe({
      next: (datos) => {
        this.tickets.set(datos);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeDeError(e));
        this.cargando.set(false);
      },
    });
  }

  protected eliminar(t: Ticket): void {
    if (!confirm(`¿Eliminar el ticket #${t.id} "${t.asunto}"? Esta acción no se puede deshacer.`)) return;
    this.servicio.eliminar(t.id).subscribe({
      next: () => {
        this.tickets.update((lista) => lista.filter((x) => x.id !== t.id));
        this.error.set('');
        this.exito.set(`Ticket #${t.id} eliminado.`);
      },
      error: (e) => {
        this.exito.set('');
        this.error.set(mensajeDeError(e));
      },
    });
  }

  // Clase CSS según valor, p. ej. "En proceso" -> "en-proceso"
  protected clase(valor: string): string {
    return valor.toLowerCase().replace(/\s+/g, '-');
  }
}
