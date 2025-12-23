import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';
import { CensoService, EstadoCenso } from '../../services/censo.service';
import { catchError, finalize, of, timeout } from 'rxjs';

export type EstadosChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-estados',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './estados.html',
  styleUrls: ['./estados.css'],
})
export class EstadosComponent implements OnInit {
  private censo = inject(CensoService);

  estados: EstadoCenso[] = [];
  loading = true;
  errorMsg = '';
  selectedName = '';

  // Configuración inicial de la gráfica
  chartOptions: EstadosChartOptions = {
    series: [],
    chart: {
      type: 'donut',
    },
    labels: [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' },
        },
      },
    ],
  };

  ngOnInit(): void {
    this.censo
      .getEstados()
      .pipe(
        timeout(15000),
        catchError((err) => {
          console.error('Error HTTP:', err);
          this.errorMsg = 'No pude cargar los estados.';
          return of([] as EstadoCenso[]);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((data) => {
        console.log('Estados recibidos:', data.length);

        // Orden alfabético para el selector y la tabla
        this.estados = data.sort((a, b) => a.name.localeCompare(b.name));

        // Tomar los 10 estados más poblados para la gráfica
        const topEstados = [...this.estados]
          .sort((a, b) => b.population - a.population)
          .slice(0, 10);

        // Actualizar opciones de la gráfica
        this.chartOptions = {
          ...this.chartOptions,
          series: topEstados.map((e) => e.population),
          labels: topEstados.map((e) => e.name),
        };
      });
  }

  get selectedState(): EstadoCenso | undefined {
    return this.estados.find((e) => e.name === this.selectedName);
  }
}
