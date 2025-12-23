import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CensoService, EstadoCenso } from './services/censo.service';
import { catchError, finalize, of, timeout } from 'rxjs';

@Component({
  selector: 'app-estados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estados.html',
  styleUrls: ['./estados.css'],
})
export class EstadosComponent implements OnInit {
  private censo = inject(CensoService);

  estados: EstadoCenso[] = [];
  loading = true;
  errorMsg = '';
  selectedName = '';

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
        this.estados = data.sort((a, b) => a.name.localeCompare(b.name));
      });
  }

  get selectedState(): EstadoCenso | undefined {
    return this.estados.find((e) => e.name === this.selectedName);
  }
}
