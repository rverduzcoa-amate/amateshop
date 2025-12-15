// Add new arrival items here. Place matching video files under
// `src/assets/videos/newArrivals/` and poster images under
// `src/assets/img/newArrivals/` (the bundler will include imported files).

import naVid1 from '../assets/videos/newArrivals/pulseraItaliana.mp4';
import naVid2 from '../assets/videos/newArrivals/cadenaDoradaDijeLetaRedondo.mp4';
import naVid3 from '../assets/videos/newArrivals/aretesDoradosEslabones.mp4';

// `src` is the imported asset reference used by components; `link` navigates
// to a new-arrivals grid (optionally filtered by category).
export const newArrivals = [
  {
    id: 'na001',
    nombre: 'Pulsera Nueva 001',
    category: 'pulseras',
    src: naVid1,
    link: '/new-arrivals?category=pulseras'
  },
  {
    id: 'na002',
    nombre: 'Cadena Nueva 001',
    category: 'cadenas',
    src: naVid2,
    link: '/new-arrivals?category=cadenas'
  },
  {
    id: 'na003',
    nombre: 'Aretes Nuevo 001',
    category: 'aretes',
    src: naVid3,
    link: '/new-arrivals?category=aretes'
  }
];
