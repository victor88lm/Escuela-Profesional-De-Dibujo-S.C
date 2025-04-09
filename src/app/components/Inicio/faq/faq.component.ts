// faq.component.ts
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
  category: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        overflow: 'hidden',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class FAQComponent implements OnInit {
  activeCategory: string = 'all';
  searchTerm: string = '';

  faqItems: FaqItem[] = [
    // Categoría: Inscripciones y Admisiones
    {
      question: '¿Cuál es el proceso de inscripción a los cursos?',
      answer: 'El proceso de inscripción consta de 4 pasos sencillos: 1) Llenar el formulario de solicitud en línea o presencial, 2) Realizar una entrevista breve donde evaluaremos tus intereses y nivel, 3) Efectuar el pago de inscripción y primera mensualidad, 4) Te asignaremos un grupo y horario según tu disponibilidad. Todo el proceso puede completarse en aproximadamente 2-3 días hábiles.',
      isOpen: false,
      category: 'inscripciones'
    },
    {
      question: '¿Necesito tener experiencia previa en dibujo para inscribirme?',
      answer: 'No es necesario tener experiencia previa para la mayoría de nuestros cursos básicos. Contamos con programas para todos los niveles, desde principiantes absolutos hasta artistas avanzados. Durante el proceso de inscripción, realizamos una evaluación básica para recomendarte el curso más adecuado según tu nivel actual y objetivos.',
      isOpen: false,
      category: 'inscripciones'
    },
    {
      question: '¿Qué documentos necesito para inscribirme?',
      answer: 'Para inscribirte necesitas: identificación oficial (INE, pasaporte o credencial escolar), comprobante de domicilio reciente, 2 fotografías tamaño infantil y, en caso de menores de edad, presencia y documentación del padre o tutor. Para cursos avanzados o especializados, podríamos solicitar una muestra de tu trabajo previo o realizar una evaluación de habilidades.',
      isOpen: false,
      category: 'inscripciones'
    },
    {
      question: '¿Tienen límite de edad para inscribirse a los cursos?',
      answer: 'Nuestros cursos regulares están disponibles para personas mayores de 15 años sin límite de edad máxima. Para niños entre 8 y 14 años, ofrecemos nuestro Curso Infantil especializado que adapta las técnicas y metodologías a su edad. Valoramos la diversidad de edades en nuestras clases y nos aseguramos de que todos puedan desarrollar su potencial artístico independientemente de su edad.',
      isOpen: false,
      category: 'inscripciones'
    },

    // Categoría: Horarios y Modalidades
    {
      question: '¿Cuáles son los horarios de clases disponibles?',
      answer: 'Ofrecemos horarios flexibles para adaptarnos a tus necesidades: Turno matutino (9:00 - 13:00), vespertino (15:00 - 19:00), nocturno (19:00 - 21:00) y sabatino (9:00 - 14:00). Puedes elegir entre asistir 2 días entre semana o un día completo los sábados, dependiendo del curso. Al inscribirte, podrás seleccionar el horario que mejor se adapte a tu agenda personal o laboral.',
      isOpen: false,
      category: 'horarios'
    },
    {
      question: '¿En qué fechas comienzan los cursos?',
      answer: 'Iniciamos nuevos grupos en ciclos regulares durante febrero, mayo, agosto y noviembre. Sin embargo, gracias a nuestro sistema personalizado de enseñanza, es posible incorporarse a un grupo ya iniciado en cualquier momento del año, adaptándonos a tu nivel y necesidades. Para talleres especializados, abrimos grupos el primer lunes de cada mes.',
      isOpen: false,
      category: 'horarios'
    },
    {
      question: '¿Ofrecen modalidad en línea o a distancia?',
      answer: 'Actualmente nuestros cursos son presenciales, ya que consideramos fundamental la interacción directa entre profesor y alumno para el correcto aprendizaje de técnicas artísticas. Sin embargo, ofrecemos algunas asesorías y talleres complementarios en formato virtual para estudiantes ya inscritos. Estamos desarrollando programas híbridos que pronto estarán disponibles.',
      isOpen: false,
      category: 'horarios'
    },
    {
      question: '¿Puedo cambiar de horario una vez iniciado el curso?',
      answer: 'Sí, es posible cambiar de horario una vez iniciado el curso, sujeto a disponibilidad de espacios en el nuevo horario solicitado. El cambio debe solicitarse con al menos una semana de anticipación en servicios escolares. El primer cambio de horario es sin costo, a partir del segundo se aplica una cuota administrativa de $200 MXN.',
      isOpen: false,
      category: 'horarios'
    },

    // Categoría: Costos y Pagos
    {
      question: '¿Cuál es el costo de los cursos?',
      answer: 'Los costos varían según el programa y duración. Los cursos regulares tienen un costo promedio de $1,800 a $3,200 MXN mensuales, con una inscripción anual de $1,500 a $2,000 MXN. Los talleres especializados oscilan entre $3,500 y $5,000 MXN por módulo. Contamos con descuentos por pago semestral (10%) o anual (15%), así como promociones especiales para estudiantes y familiares.',
      isOpen: false,
      category: 'costos'
    },
    {
      question: '¿Ofrecen becas o descuentos?',
      answer: 'Sí, contamos con un programa de becas por mérito académico y por necesidad económica que puede cubrir del 10% al 50% del costo de los cursos. También ofrecemos descuentos por pronto pago, por referir nuevos estudiantes (15% en una mensualidad), para familiares de estudiantes actuales (10%) y para exalumnos que deseen tomar cursos adicionales (20%).',
      isOpen: false,
      category: 'costos'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos pagos en efectivo, transferencia bancaria, depósito, tarjetas de débito y crédito (Visa, Mastercard y American Express). Para pagos con tarjeta de crédito, ofrecemos la opción de meses sin intereses (3, 6 y 12) con tarjetas participantes. También contamos con la opción de pago en línea a través de nuestra plataforma segura.',
      isOpen: false,
      category: 'costos'
    },
    {
      question: '¿El costo incluye los materiales?',
      answer: 'Para los cursos infantiles y talleres introductorios, el costo incluye los materiales básicos necesarios. Para los cursos regulares y especializados, el costo no incluye todos los materiales, pero ofrecemos un kit inicial con descuento y puedes adquirir materiales adicionales en nuestra tienda escolar con 15% de descuento para estudiantes activos. Al inicio del curso, recibirás una lista detallada de los materiales recomendados según tu especialidad.',
      isOpen: false,
      category: 'costos'
    },

    // Categoría: Programas y Contenidos
    {
      question: '¿Qué programas y cursos ofrecen?',
      answer: 'Ofrecemos cuatro programas principales: 1) Dibujo Publicitario (18 meses): formación integral en técnicas de dibujo y pintura comercial, 2) Especialidad en Diseño Gráfico (24 meses): enfocado en diseño digital y producción visual, 3) Curso Infantil (12 meses): para niños de 8 a 14 años, 4) Talleres Especializados (40 horas cada uno): formación intensiva en técnicas específicas como retrato, caricatura, acuarela, óleo, aerografía, entre otros.',
      isOpen: false,
      category: 'programas'
    },
    {
      question: '¿Cuál es la duración de los cursos?',
      answer: 'La duración varía según el programa: Dibujo Publicitario tiene una duración de 18 meses, la Especialidad en Diseño Gráfico dura 24 meses, el Curso Infantil 12 meses y los Talleres Especializados 40 horas cada uno (aproximadamente 1 mes). Cada programa está diseñado para asegurar un aprendizaje progresivo y completo de las técnicas correspondientes.',
      isOpen: false,
      category: 'programas'
    },
    {
      question: '¿Los cursos tienen validez oficial?',
      answer: 'Sí, nuestros programas de Dibujo Publicitario y Especialidad en Diseño Gráfico cuentan con reconocimiento oficial de la Secretaría de Educación Pública (SEP) a través de la Dirección General de Centros de Formación para el Trabajo (DGCFT). Al finalizar, recibirás un diploma con validez oficial que acredita tus competencias en el área correspondiente.',
      isOpen: false,
      category: 'programas'
    },
    {
      question: '¿Qué software enseñan en los cursos de diseño digital?',
      answer: 'En nuestros cursos de Especialidad en Diseño Gráfico y talleres digitales, enseñamos los principales programas de la suite Adobe: Photoshop, Illustrator, InDesign, After Effects y Animate. También incluimos formación en herramientas complementarias según la especialización elegida. Nuestros laboratorios cuentan con las versiones más recientes de estos programas y licencias educativas disponibles para los estudiantes.',
      isOpen: false,
      category: 'programas'
    },

    // Categoría: Instalaciones y Servicios
    {
      question: '¿Dónde están ubicadas sus sucursales?',
      answer: 'Contamos con dos sucursales principales: 1) Sucursal Centro: ubicada en Eje Central Lázaro Cárdenas 150, Col. Guerrero, frente al Metro Garibaldi, 2) Sucursal Ecatepec: ubicada en Av. Insurgentes esq. con Palmas, Col. La Mora, San Cristóbal Ecatepec. Ambas instalaciones cuentan con talleres especializados, estudios, aulas digitales y todos los servicios necesarios para tu formación artística.',
      isOpen: false,
      category: 'instalaciones'
    },
    {
      question: '¿Tienen estacionamiento para estudiantes?',
      answer: 'La sucursal Centro cuenta con convenios con estacionamientos cercanos que ofrecen tarifas preferentes para nuestros estudiantes (descuento del 30%). La sucursal Ecatepec dispone de estacionamiento propio con tarifa preferencial de $25 pesos por día para estudiantes. En ambas ubicaciones, recomendamos también el uso de transporte público, ya que están bien conectadas con diferentes rutas.',
      isOpen: false,
      category: 'instalaciones'
    },
    {
      question: '¿Ofrecen servicio de cafetería o comedor?',
      answer: 'Ambas sedes cuentan con área de descanso y cafetería donde puedes consumir alimentos y bebidas. La sucursal Centro ofrece servicio de cafetería con opciones económicas de alimentos preparados, mientras que en la sucursal Ecatepec disponemos de máquinas expendedoras y microondas para calentar alimentos traídos de casa. También encontrarás opciones de alimentación accesibles en los alrededores de ambas instalaciones.',
      isOpen: false,
      category: 'instalaciones'
    },
    {
      question: '¿Cuentan con tienda de materiales?',
      answer: 'Sí, en ambas sucursales contamos con tienda de materiales artísticos donde podrás encontrar todo lo necesario para tus clases con un descuento permanente del 15% para estudiantes activos. Ofrecemos desde materiales básicos hasta productos profesionales especializados. También contamos con servicio de asesoría para ayudarte a elegir los materiales más adecuados según tu técnica y presupuesto.',
      isOpen: false,
      category: 'instalaciones'
    },

    // Categoría: Vida Estudiantil
    {
      question: '¿Organizan exposiciones o eventos para los estudiantes?',
      answer: 'Sí, realizamos exposiciones semestrales donde los estudiantes pueden mostrar sus mejores trabajos al público. También organizamos concursos internos, participación en ferias de arte, visitas a museos y galerías, talleres con artistas invitados y eventos de networking con empresas del sector. Estas actividades complementan tu formación y te permiten comenzar a construir tu presencia en el mundo artístico.',
      isOpen: false,
      category: 'estudiantes'
    },
    {
      question: '¿Ofrecen bolsa de trabajo para egresados?',
      answer: 'Contamos con un programa de vinculación laboral que conecta a nuestros egresados con oportunidades profesionales en estudios de diseño, agencias de publicidad, editoriales y empresas que requieren talento creativo. Mantenemos convenios con más de 50 empresas del sector y ofrecemos talleres de emprendimiento para quienes desean establecer su propio negocio. El 85% de nuestros egresados se coloca laboralmente dentro de los 6 meses posteriores a su graduación.',
      isOpen: false,
      category: 'estudiantes'
    },
    {
      question: '¿Cuántos alumnos hay por grupo?',
      answer: 'Nuestros grupos son reducidos para garantizar atención personalizada, con un máximo de 15 alumnos por clase en cursos regulares y 10 alumnos en talleres especializados. Esto permite que cada estudiante reciba retroalimentación individual y pueda avanzar a su propio ritmo. Los talleres especializados de nivel avanzado pueden ser aún más personalizados, llegando incluso a clases individuales en técnicas muy específicas.',
      isOpen: false,
      category: 'estudiantes'
    },
    {
      question: '¿Puedo recuperar clases si falto por algún motivo?',
      answer: 'Sí, ofrecemos un sistema flexible de recuperación de clases. Puedes recuperar hasta 3 clases por mes, siempre que notifiques tu inasistencia con anticipación. Las recuperaciones pueden programarse en diferentes horarios según disponibilidad, dentro de los 30 días siguientes a tu falta. Para talleres especializados, las recuperaciones se coordinan directamente con el instructor.',
      isOpen: false,
      category: 'estudiantes'
    }
  ];

  filteredItems: FaqItem[] = this.faqItems;

  ngOnInit() {
    this.filterByCategory('all');
  }

  toggleFaq(index: number): void {
    // Cerrar todas las preguntas antes de abrir la seleccionada
    this.filteredItems.forEach((item, i) => {
      if (i !== index) {
        item.isOpen = false;
      }
    });

    // Invertir el estado de la pregunta seleccionada
    this.filteredItems[index].isOpen = !this.filteredItems[index].isOpen;
  }

  filterByCategory(category: string): void {
    this.activeCategory = category;
    
    if (category === 'all') {
      this.filteredItems = this.faqItems;
    } else {
      this.filteredItems = this.faqItems.filter(item => item.category === category);
    }

    // Si hay un término de búsqueda, aplicar también ese filtro
    if (this.searchTerm.trim()) {
      this.applySearch();
    }
  }

  applySearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filterByCategory(this.activeCategory);
      return;
    }

    // Filtrar primero por categoría (si no es 'all')
    let baseItems = this.activeCategory === 'all' ? 
      this.faqItems : 
      this.faqItems.filter(item => item.category === this.activeCategory);
    
    // Luego filtrar por término de búsqueda
    this.filteredItems = baseItems.filter(item => 
      item.question.toLowerCase().includes(term) || 
      item.answer.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterByCategory(this.activeCategory);
  }
}