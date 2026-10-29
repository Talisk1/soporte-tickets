import { Routes } from '@angular/router';
import { TicketForm } from './components/ticket-form/ticket-form';
import { TicketList } from './components/ticket-list/ticket-list';

export const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  { path: 'tickets', component: TicketList },
  { path: 'tickets/nuevo', component: TicketForm },
  { path: 'tickets/:id/editar', component: TicketForm },
  { path: '**', redirectTo: 'tickets' },
];
