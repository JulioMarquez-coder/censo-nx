import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ADD
import { CensoService, EstadoCenso } from '../../services/censo.service';

type Orden =
  | 'poblacion-desc'
  | 'poblacion-asc'
  | 'alfabetico-asc'
  | 'alfabetico-desc';

@Component({
  selector: 'app-tabla-estados',
  standalone: true,
  imports: [CommonModule, FormsModule], // ADD
  templateUrl: './tabla-estados.html',
  styleUrls: ['./tabla-estados.css'],
})

export class TablaEstadosComponent implements OnInit {
  private censo = inject(CensoService);

  estados: EstadoCenso[] = [];
  loading = true;
  error = '';

  ordenActual: Orden = 'alfabetico-asc'; // default

  busqueda = ''; // ADD

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

  // FILTRA + ORDENA
  get estadosFiltradosOrdenados(): EstadoCenso[] {
    const q = this.busqueda.trim().toLowerCase();

    const filtrados = q
      ? this.estados.filter((e) => e.name.toLowerCase().includes(q))
      : this.estados;

    return [...filtrados].sort((a, b) => {
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
  }}