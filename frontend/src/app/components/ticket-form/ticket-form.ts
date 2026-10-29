import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CATEGORIAS, ESTADOS, PRIORIDADES, TicketInput } from '../../models/ticket';
import { TicketService, mensajeDeError } from '../../services/ticket.service';

// Se usa tanto para crear (/tickets/nuevo) como para editar (/tickets/:id/editar).
@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-form.html',
})
export class TicketForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(TicketService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly categorias = CATEGORIAS;
  protected readonly prioridades = PRIORIDADES;
  protected readonly estados = ESTADOS;

  protected readonly id = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal('');
  protected readonly intentado = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    asunto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    solicitante: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    categoria: ['', [Validators.required]],
    prioridad: ['', [Validators.required]],
    estado: ['Abierto', [Validators.required]],
  });

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (!param) return;
    const id = Number(param);
    this.id.set(id);
    this.cargando.set(true);
    this.servicio.obtener(id).subscribe({
      next: (t) => {
        this.form.patchValue(t);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeDeError(e));
        this.cargando.set(false);
      },
    });
  }

  // Un campo muestra error si fue tocado o si se intentó enviar.
  protected invalido(campo: keyof TicketInput): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.intentado());
  }

  protected guardar(): void {
    this.intentado.set(true);
    this.error.set('');
    if (this.form.invalid) return;

    const datos = this.form.getRawValue() as TicketInput;
    const id = this.id();
    const peticion = id === null ? this.servicio.crear(datos) : this.servicio.actualizar(id, datos);

    this.guardando.set(true);
    peticion.subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: (e) => {
        this.error.set(mensajeDeError(e));
        this.guardando.set(false);
      },
    });
  }
}
