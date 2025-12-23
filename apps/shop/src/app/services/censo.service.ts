import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface EstadoCenso {
  name: string;
  population: number;
}

@Injectable({ providedIn: 'root' })
export class CensoService {
  private http = inject(HttpClient);

  private url =
    'https://api.census.gov/data/2023/acs/acs5?get=NAME,B01003_001E&for=state:*';

  getEstados(): Observable<EstadoCenso[]> {
    return this.http.get<string[][]>(this.url).pipe(
      map((rows) =>
        rows.slice(1).map((row) => ({
          name: row[0],
          population: Number(row[1]),
        }))
      )
    );
  }
}
