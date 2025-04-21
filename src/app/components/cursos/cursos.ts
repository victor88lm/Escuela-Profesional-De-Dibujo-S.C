// src/app/data/cursos.ts

export interface Curso {
  id: number;
  slug: string; // URL amigable para ruteo
  titulo: string;
  subtitulo: string;
  descripcionCorta: string;
  descripcionCompleta: string;
  categoria: string; // "infantil", "profesional", "avanzado", etc.
  nivel: string; // "Básico", "Intermedio", "Avanzado"
  imagen: string; // URL de la imagen principal
  imagenes: string[]; // URLs para la galería
  costoInscripcion: string;
  colegiatura: string;
  fechaInscripcion: string;
  fechaInicio: string;
  fechaFin?: string; // Opcional
  profesor: string;
  duracion: string;
  horarios: string[];
  caracteristicas: string[];
  temario: string[];
  beneficios?: string[]; // Opcional
  color: string; // "blue", "pink", "green", "orange", etc. para estilos
  videoFondo?: string; // URL del video de fondo, opcional
}

export const CURSOS: Curso[] = [
  {
    id: 1,
    slug: 'dibujo-infantil',
    titulo: 'Taller de Dibujo Infantil',
    subtitulo: '¡Despierta la creatividad de los niños a través del arte!',
    descripcionCorta:
      'Curso diseñado para estimular la creatividad de los más pequeños mediante técnicas de dibujo.',
    descripcionCompleta:
      'Este taller está diseñado para niños que desean explorar el mundo del arte a través del dibujo. En un ambiente divertido y seguro, los pequeños desarrollarán habilidades artísticas, motricidad fina y aprenderán a expresar sus ideas de forma visual mientras se divierten.',
    categoria: 'infantil',
    nivel: 'Principiante',
    imagen:
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/dibujoInfantil/DInfantil01.avif',
    imagenes: [
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/dibujoInfantil/DInfantil02.avif',
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/dibujoInfantil/DInfantil03.avif',
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/dibujoInfantil/DInfantil04.avif',
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/dibujoInfantil/DInfantil05.avif',
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/dibujoInfantil/DInfantil06.avif',
    ],
    costoInscripcion: '$250 MXN',
    colegiatura: '$1200 MXN',
    fechaInscripcion: 'Todo el año',
    fechaInicio: '1er sábado de cada mes',
    profesor: 'Varios profesores',
    duracion: '3 meses',
    horarios: ['Sábados de 10:00 a 12:00'],
    caracteristicas: [
      'Edad recomendada: 5-12 años',
      'Materiales incluidos',
      'Clases dinámicas y divertidas',
    ],
    temario: [
      'Explorando formas básicas y colores',
      'Dibujando nuestros personajes favoritos',
      'El mundo de los animales',
      'Paisajes y naturaleza',
      'Técnicas con crayones y acuarelas',
      'Historias ilustradas',
      'Collage y técnicas mixtas',
      'Exposición final de trabajos',
    ],
    beneficios: [
      'Desarrollo de habilidades motoras finas',
      'Incremento de la creatividad e imaginación',
      'Mejora en la capacidad de concentración',
      'Fortalecimiento de la confianza y autoestima',
      'Desarrollo de habilidades de observación',
      'Expresión saludable de emociones a través del arte',
    ],
    color: 'orange',
    videoFondo: 'video/talleres.mp4',
  },
  {
    id: 2,
    slug: 'dibujo-publicitario',
    titulo: 'Curso de Dibujo Publicitario',
    subtitulo: 'Aprende técnicas profesionales de ilustración para publicidad',
    descripcionCorta:
      'Aprende técnicas profesionales de ilustración para publicidad y medios digitales.',
    descripcionCompleta:
      'Curso diseñado para enseñar técnicas avanzadas de dibujo e ilustración para la industria publicitaria.',
    categoria: 'profesional',
    nivel: 'Intermedio-Avanzado',
    imagen:
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/dibujoPublicitario/DP_01.avif',
    imagenes: [
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/dibujoPublicitario/DP_01.avif',
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/dibujoPublicitario/DP_02.avif',
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/dibujoPublicitario/DP_03.avif',
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/dibujoPublicitario/DP_04.avif',
    ],
    costoInscripcion: '$650 MXN',
    colegiatura: '$1680 MXN',
    fechaInscripcion: 'Abril 2025',
    fechaInicio: '3, 5 y 6 de mayo',
    profesor: 'Luis Martínez',
    duracion: '6 meses',
    horarios: [
      'Lunes y Miércoles de 18:00 a 20:00',
      'Sábados de 09:00 a 13:00',
    ],
    caracteristicas: [
      'Conceptos de branding visual',
      'Uso de herramientas digitales',
      'Enfoque en comunicación gráfica',
    ],
    temario: [
      'Introducción al Dibujo Publicitario',
      'Fundamentos de la Ilustración Profesional',
      'Técnicas de Dibujo Digital',
      'Branding Visual y Publicidad',
      'Software y Herramientas Digitales para la Ilustración',
      'Creación de Proyectos Publicitarios',
      'Preparación de Portafolio para Clientes',
    ],
    color: 'blue',
    videoFondo: 'video/talleres.mp4',
  },
  {
    id: 3,
    slug: 'diseno-grafico',
    titulo: 'Curso de Diseño Gráfico',
    subtitulo:
      'Domina las herramientas y técnicas para crear diseños impactantes',
    descripcionCorta:
      'Domina los fundamentos del diseño gráfico con un enfoque práctico y moderno.',
    descripcionCompleta:
      'Este curso abarca todas las áreas del diseño gráfico moderno, desde la teoría del color y la composición hasta el dominio de software especializado como Adobe Creative Suite, preparándote para destacar en la industria visual.',
    categoria: 'avanzado',
    nivel: 'Intermedio-Avanzado',
    imagen:
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/disenioGrafico/DG01.avif',
    imagenes: [
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/disenioGrafico/DG01.avif',
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/disenioGrafico/DG02.avif',
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/disenioGrafico/DG03.avif',
      'https://epd.edu.mx/Pagina_Principal/Cursos/img/cursos/disenioGrafico/DG04.avif',
    ],
    costoInscripcion: '$750 MXN',
    colegiatura: '$1830 MXN',
    fechaInscripcion: 'Abril 2025',
    fechaInicio: '3, 5 y 6 de mayo',
    profesor: 'Ana García',
    duracion: '8 meses',
    horarios: ['Martes y Jueves de 18:00 a 21:00', 'Sábados de 10:00 a 14:00'],
    caracteristicas: [
      'Principios de diseño visual',
      'Uso de software profesional',
      'Proyectos reales para tu portafolio',
    ],
    temario: [
      'Fundamentos del Diseño Gráfico',
      'Teoría del Color y Composición Visual',
      'Tipografía y Jerarquía Visual',
      'Adobe Photoshop - Edición de Imágenes',
      'Adobe Illustrator - Diseño Vectorial',
      'Adobe InDesign - Maquetación Editorial',
      'Diseño para Medios Digitales',
      'Identidad Corporativa y Branding',
      'Desarrollo de Portafolio Profesional',
    ],
    color: 'pink',
    videoFondo: 'video/talleres.mp4',
  },
];

// Función para obtener un curso por su slug
export function getCursoBySlug(slug: string): Curso | undefined {
  return CURSOS.find((curso) => curso.slug === slug);
}

// Función para obtener un curso por su ID
export function getCursoById(id: number): Curso | undefined {
  return CURSOS.find((curso) => curso.id === id);
}

// Función para filtrar cursos por categoría
export function getCursosByCategoria(categoria: string): Curso[] {
  return CURSOS.filter((curso) => curso.categoria === categoria);
}
