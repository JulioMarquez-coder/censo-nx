import { Component } from '@angular/core';

@Component({
  selector: 'app-puerto-rico',
  standalone: true,
  imports: [],
  templateUrl: './puerto-rico.html',
  styleUrls: ['./puerto-rico.css'],
})
export class PuertoRicoComponent {
  // 🔹 Datos solo de Morovis por ahora
  poblacionPorMunicipio: Record<string, { nombre: string; poblacion: number }> =
    {
  'PR-SJ': { nombre: 'San Juan', poblacion: 320000 },
  'PR-BY': { nombre: 'Bayamón', poblacion: 186000 },
  'PR-CN': { nombre: 'Carolina', poblacion: 170000 },
  'PR-PO': { nombre: 'Ponce', poblacion: 138000 },
  'PR-CG': { nombre: 'Caguas', poblacion: 127000 },
  'PR-GB': { nombre: 'Guaynabo', poblacion:  89000 },
  'PR-AC': { nombre: 'Arecibo', poblacion:  85000 },
  'PR-MG': { nombre: 'Mayagüez', poblacion:  73000 },

  'PR-MV': { nombre: 'Morovis', poblacion: 31000 },
  'PR-OR': { nombre: 'Orocovis', poblacion: 20000 },
  'PR-BQ': { nombre: 'Barranquitas', poblacion: 29000 },
  'PR-AI': { nombre: 'Aibonito', poblacion: 25000 },
  'PR-CM': { nombre: 'Comerío', poblacion: 19000 },
  'PR-JY': { nombre: 'Jayuya', poblacion: 14000 },

  'PR-AL': { nombre: 'Aguadilla', poblacion: 54000 },
  'PR-AN': { nombre: 'Añasco', poblacion: 26000 },
  'PR-RC': { nombre: 'Rincón', poblacion: 15000 },
  'PR-SG': { nombre: 'San Germán', poblacion: 30000 },
  'PR-LR': { nombre: 'Lares', poblacion: 25000 },

  'PR-FJ': { nombre: 'Fajardo', poblacion: 32000 },
  'PR-LQ': { nombre: 'Luquillo', poblacion: 18000 },
  'PR-HU': { nombre: 'Humacao', poblacion: 50000 },
  'PR-NG': { nombre: 'Naguabo', poblacion: 26000 },
  'PR-YB': { nombre: 'Yabucoa', poblacion: 30000 },
  //
    // Sureste / Este
  'PR-MB': { nombre: 'Maunabo', poblacion: 11000 },
  'PR-PT': { nombre: 'Patillas', poblacion: 18000 },
  'PR-GM': { nombre: 'Guayama', poblacion: 42000 },
  'PR-SA': { nombre: 'Salinas', poblacion: 30000 },
  'PR-AR': { nombre: 'Arroyo', poblacion: 16000 },

  // Área metro / norte
  'PR-TJ': { nombre: 'Trujillo Alto', poblacion: 74000 },
  'PR-CV': { nombre: 'Canóvanas', poblacion: 47000 },
  'PR-TA': { nombre: 'Toa Alta', poblacion: 74000 },
  'PR-TB': { nombre: 'Toa Baja', poblacion: 74000 },
  'PR-CT': { nombre: 'Cataño', poblacion: 23000 },
  'PR-LZ': { nombre: 'Loíza', poblacion: 26000 },

  // Centro / montaña
  'PR-UT': { nombre: 'Utuado', poblacion: 29000 },
  'PR-CL': { nombre: 'Ciales', poblacion: 17000 },
  'PR-FL': { nombre: 'Florida', poblacion: 12000 },
  'PR-VA': { nombre: 'Vega Alta', poblacion: 39000 },
  'PR-VB': { nombre: 'Vega Baja', poblacion: 54000 },

  // Oeste adicional
  'PR-SB': { nombre: 'Sabana Grande', poblacion: 23000 },
  'PR-PN': { nombre: 'Peñuelas', poblacion: 22000 },
  'PR-GC': { nombre: 'Guánica', poblacion: 14000 },
  'PR-YU': { nombre: 'Yauco', poblacion: 37000 },
  'PR-MC': { nombre: 'Moca', poblacion: 38000 },

  // Norte / noreste adicional
  'PR-MT': { nombre: 'Manatí', poblacion: 41000 },
  'PR-DO': { nombre: 'Dorado', poblacion: 36000 },
  'PR-BC': { nombre: 'Barceloneta', poblacion: 25000 },
  'PR-HA': { nombre: 'Hatillo', poblacion: 38000 },

  // Sur adicional
  'PR-JD': { nombre: 'Juana Díaz', poblacion: 44000 },
  'PR-SI': { nombre: 'Santa Isabel', poblacion: 22000 },
  'PR-CO': { nombre: 'Coamo', poblacion: 36000 },
  'PR-VL': { nombre: 'Villalba', poblacion: 23000 },

  // FALTANTES

'PR-AJ': { nombre: 'Adjuntas',      poblacion: 18000 },
'PR-AD': { nombre: 'Aguada',        poblacion: 38000 },
'PR-AB': { nombre: 'Aguas Buenas',  poblacion: 26000 },
'PR-CR': { nombre: 'Cabo Rojo',     poblacion: 47000 },
'PR-CY': { nombre: 'Cayey',         poblacion: 47000 },
'PR-CB': { nombre: 'Ceiba',         poblacion: 12000 },
'PR-CD': { nombre: 'Cidra',         poblacion: 39000 },
'PR-CZ': { nombre: 'Corozal',       poblacion: 37000 },
'PR-CU': { nombre: 'Culebra',       poblacion: 1800  },

'PR-GL': { nombre: 'Guayanilla',    poblacion: 20000 },
'PR-GR': { nombre: 'Gurabo',        poblacion: 47000 },
'PR-HO': { nombre: 'Hormigueros',   poblacion: 17000 },
'PR-IS': { nombre: 'Isabela',       poblacion: 42000 },
'PR-JC': { nombre: 'Juncos',        poblacion: 40000 },

'PR-LJ': { nombre: 'Lajas',         poblacion: 24000 },
'PR-LM': { nombre: 'Las Marías',    poblacion: 9000  },
'PR-LP': { nombre: 'Las Piedras',   poblacion: 38000 },
'PR-MR': { nombre: 'Maricao',       poblacion: 6000  },

'PR-NR': { nombre: 'Naranjito',     poblacion: 29000 },
'PR-QB': { nombre: 'Quebradillas',  poblacion: 25000 },
'PR-RG': { nombre: 'Río Grande',    poblacion: 50000 },

'PR-SL': { nombre: 'San Lorenzo',   poblacion: 38000 },
'PR-SS': { nombre: 'San Sebastián', poblacion: 41000 },

'PR-VQ': { nombre: 'Vieques',       poblacion: 9000  },
'PR-CA': {nombre: 'Camuy',            poblacion: 9000},



    };

  // 🔹 Estado del municipio actual
  hoveredMunicipio: string | null = null;
  hoveredMunicipioNombre = '';
  hoveredMunicipioPoblacion: number | null = null;

  // 🔹 Posición del tooltip
  tooltipX = 0;
  tooltipY = 0;

  // 🟢 Método genérico para CUALQUIER municipio
  onMunicipioEnter(event: MouseEvent) {
    const target = event.target as SVGElement;
    const id = target.getAttribute('id');

    console.log('DEBUG id:', id); // 👈 para ver en la consola del navegador

    if (!id || !this.poblacionPorMunicipio[id]) {
      return;
    }

    const data = this.poblacionPorMunicipio[id];
    this.hoveredMunicipio = id;
    this.hoveredMunicipioNombre = data.nombre;
    this.hoveredMunicipioPoblacion = data.poblacion;
  }
  // 🎨 Color según población
getColorByPopulation(id: string | null): string {
  if (!id || !this.poblacionPorMunicipio[id]) {
    return '#e5e7eb'; // gris por defecto
  }

  const poblacion = this.poblacionPorMunicipio[id].poblacion;

  if (poblacion > 150000) return '#1e3a8a'; // azul oscuro
  if (poblacion > 80000)  return '#2563eb'; // azul medio
  if (poblacion > 40000)  return '#60a5fa'; // azul claro
  if (poblacion > 20000)  return '#93c5fd'; // azul muy claro

  return '#bfdbfe'; // pueblos pequeños
}


  // 🔴 Cuando sale del municipio (o queremos esconder todo)
  onMunicipioLeave() {
    this.hoveredMunicipio = null;
    this.hoveredMunicipioNombre = '';
    this.hoveredMunicipioPoblacion = null;
  }

  // 📍 Actualiza la posición del tooltip
  onMouseMove(event: MouseEvent) {
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();

    this.tooltipX = event.clientX - rect.left + 10;
    this.tooltipY = event.clientY - rect.top + 10;
  }
}
