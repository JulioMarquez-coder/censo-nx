import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CensoService, EstadoCenso } from '../../services/censo.service';

// 📊 IMPORTS DE APEXCHARTS
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
} from 'ng-apexcharts';

type Orden =
  | 'poblacion-desc'
  | 'poblacion-asc'
  | 'alfabetico-asc'
  | 'alfabetico-desc';

// 📊 TIPO PARA LAS OPCIONES DE LA GRÁFICA
export type EstadosCompareChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-tabla-estados',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './tabla-estados.html',
  styleUrls: ['./tabla-estados.css'],
})
export class TablaEstadosComponent implements OnInit {
  private censo = inject(CensoService);

  estados: EstadoCenso[] = [];
  loading = true;
  error = '';

  ordenActual: Orden = 'alfabetico-asc'; // default
  busqueda = ''; // buscador

  // lista de estados seleccionados para comparar
  compareList: EstadoCenso[] = [];
  maxCompare = 3;

  // 📊 Opciones iniciales de la gráfica de comparación
  compareChartOptions: EstadosCompareChartOptions = {
    series: [
      {
        name: 'Población',
        data: [],
      },
    ],
    chart: {
      type: 'bar',
      height: 300,
    },
    xaxis: {
      categories: [],
    },
  };

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

  onOrdenChange(valor: string) {
  this.ordenActual = valor as Orden;
}


  // alternar selección de un estado
  toggleCompare(estado: EstadoCenso) {
    const idx = this.compareList.findIndex((e) => e.name === estado.name);

    if (idx >= 0) {
      // si ya estaba, lo quitamos
      this.compareList.splice(idx, 1);
    } else if (this.compareList.length < this.maxCompare) {
      // si no está y aún no llegamos al máximo, lo añadimos
      this.compareList.push(estado);
    } else {
      console.warn('Máximo de estados para comparar alcanzado');
    }

    this.updateChartFromCompareList();
  }

  // saber si un estado ya está seleccionado
  isInCompare(estado: EstadoCenso): boolean {
    return this.compareList.some((e) => e.name === estado.name);
  }

  // limpiar el panel de comparación
  clearCompare() {
    this.compareList = [];
    this.updateChartFromCompareList();
  }

  // 🔄 actualizar gráfica según compareList
  private updateChartFromCompareList() {
    const labels = this.compareList.map((e) => e.name);
    const values = this.compareList.map((e) => e.population);

    this.compareChartOptions = {
      ...this.compareChartOptions,
      series: [
        {
          name: 'Población',
          data: values,
        },
      ],
      xaxis: {
        ...this.compareChartOptions.xaxis,
        categories: labels,
      },
    };
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
  }
}
