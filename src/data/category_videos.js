// js/category_videos.js
import pulseraVid from '../assets/videos/pulseraDoradaVariados.mp4';
import aretesVid from '../assets/videos/aretesDoradosEslabones.mp4';
import cadenasVid from '../assets/videos/cadenaDoradaDijeLetaRedondo.mp4';

export const categoryVideoBanners = [
    {
        id: 'C1',
        category: 'pulseras', // Nombre de la categoría a cargar
        src: pulseraVid, // Video de la categoría Pulseras
        titulo: 'Pulseras Exclusivas',
        link: '#home?categoria=pulseras', // Enlace al que irá el clic 
    },
    {
        id: 'C2',
        category: 'aretes', // Nombre de la categoría a cargar
        src: aretesVid, // Video de la categoría Aretes
        titulo: 'Aretes Lindos',
        link: '#home?categoria=aretes', 
    },
    // Añade más videos según tus categorías
    {
        id: 'C3',
        category: 'cadenas',
        src: cadenasVid,
        titulo: 'Collares Elegantes',
        link: '#home?categoria=cadenas',
    }
];