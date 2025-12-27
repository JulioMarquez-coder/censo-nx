import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  title = 'Censo de Estados';

  private router = inject(Router);

  private get cleanUrl(): string {
    return this.router.url.split('?')[0];
  }

  // Home = cualquier ruta que NO sea /estados ni /tabla-estados
  get isHomePage(): boolean {
    const url = this.cleanUrl;
    return !url.includes('/estados') && !url.includes('/tabla-estados');
  }

  // Página de gráfica
  get isEstadosPage(): boolean {
    const url = this.cleanUrl;
    return url.includes('/estados') && !url.includes('/tabla-estados');
  }

  // Página de tabla
  get isTablaPage(): boolean {
    const url = this.cleanUrl;
    return url.includes('/tabla-estados');
  }
}
