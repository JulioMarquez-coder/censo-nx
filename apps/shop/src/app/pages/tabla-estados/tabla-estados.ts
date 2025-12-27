import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CensoService, EstadoCenso } from '../../services/censo.service';

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
}
