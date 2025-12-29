import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CensoService, EstadoCenso } from '../../services/censo.service';

type Orden =
  | 'poblacion-desc'
  | 'poblacion-asc'
  | 'alfabetico-asc'
  | 'alfabetico-desc';

@Component({
  selector: 'app-tabla-estados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-estados.html',
  styleUrls: ['./tabla-estados.css'],
})

export class TablaEstadosComponent implements OnInit {
  private censo = inject(CensoService);

  estados: EstadoCenso[] = [];
  loading = true;
  error = '';

  ordenActual: Orden = 'poblacion-desc'; // default

  ngOnInit(): void {
    this.censo.getEstados().subscribe({
      next: (data) => {
        this.estados = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Ocurrió un error al cargar los estados.';
        this.loading = false;
      },
    });
  }

  cambiarOrden(orden: Orden) {
    this.ordenActual = orden;
  }

  get estadosOrdenados(): EstadoCenso[] {
    return [...this.estados].sort((a, b) => {
      switch (this.ordenActual) {
        case 'poblacion-desc':
          return b.population - a.population;

        case 'poblacion-asc':
          return a.population - b.population;

        case 'alfabetico-asc':
          return a.name.localeCompare(b.name);

        case 'alfabetico-desc':
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });
  }
}

