// ============================================================================
// Datos del curriculum. Edita este archivo para actualizar contenido o logos.
// Cada objeto de "companies" es una tarjeta de la línea de tiempo.
//   - interactive: true  -> tiene logo clicable que centra su información
//   - logo: URL de imagen online. Si falla o no la conoces, deja "" y el
//           sitio generará automáticamente un ícono con las iniciales.
//   - clients: logos NO interactivos que se muestran dentro de la tarjeta
//              (ej. clientes atendidos, no empleadores)
// ============================================================================

export const PROFILE = {
  name: "Isaac Jalil Romero Franco",
  location: "C.P. 54719, Cuautitlán Izcalli, México",
  phone: "+52 55 1287 7616",
  email: "jalildante@gmail.com",
  summary:
    "Coordinador experimentado con un fuerte enfoque en la colaboración en equipo y la consecución de resultados. " +
    "Experto en gestión de proyectos, comunicación y resolución de problemas. Flexibilidad ante las necesidades " +
    "cambiantes y fiabilidad en la entrega de resultados. Preparado para generar un impacto significativo en " +
    "entornos dinámicos.",
  goal:
    "Objetivo actual: regresar a Jugos del Valle en una posición de Manejo de Datos en Business Intelligence.",
};

export const SKILLS = [
  "Gestión y actualización de bases de datos",
  "Ofimática avanzada: tableros interactivos",
  "Excel Avanzado",
  "Cálculo y gestión de KPI",
  "Auditor ISOs",
  "Implementador de 5S",
  "HP WebJetAdmin",
  "ERP: SAP",
  "DMS: Loyal",
  "CRM: Oracle Siebel",
  "Tickets: ServiceNow, Remedy",
  "Power BI",
  "Recuperación de datos: Acronis Cyber Protect Cloud",
  "Infraestructura: CCTV, cableado estructurado, Hand Helds",
  "Escritorio remoto y consolas: Symphony, Avaya",
  "Planificación presupuestaria",
  "Liderazgo administrativo",
  "Gestión de documentos",
  "Colaboración en equipo",
  "Adaptabilidad y flexibilidad",
  "Atención al detalle",
  "Cumplimiento normativo",
  "Gestión de flujo de trabajo",
  "Coordinación de proveedores",
  "Coordinación logística",
  "Resolución de problemas",
  "Comunicación efectiva",
  "Habilidades analíticas",
];

export const EDUCATION = [
  {
    title: "Ingeniería en Sistemas Computacionales",
    place: "Universidad Tecnológica Latinoamericana en Línea — Naucalpan, México",
    period: "01/2020",
    detail: "Promedio general 9.52",
  },
  {
    title: "Licenciatura en Informática",
    place: "Tecnológico de Estudios Superiores Cuautitlán Izcalli — Cuautitlán Izcalli, Edo. de Méx.",
    period: "Certificado parcial, 8vo semestre",
  },
  {
    title: "Dibujo Publicitario",
    place: "Escuela Profesional de Dibujo — Cuautitlán Izcalli, Edo. de Méx.",
    period: "2 años, certificado",
  },
];

export const HABITS =
  "Orientado al aprendizaje constante, actualmente me enfoco en la especialización en Ciencia de Datos. En mi " +
  "tiempo libre equilibro mi desarrollo técnico con el bienestar físico y la participación en brigadas y " +
  "voluntariado. Tengo interés por la lectura y los podcasts de historia y ciencia, lo que me permite mantener " +
  "una visión crítica y actualizada de mi entorno.";

// Logos de clientes (NO interactivos), reutilizables dentro de cualquier tarjeta
export const CLIENT_LOGOS = {
  imss: { name: "IMSS", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Instituto_Mexicano_del_Seguro_Social_logo.svg" },
  cfe: { name: "CFE", logo: "https://upload.wikimedia.org/wikipedia/commons/8/85/CFE_2020.svg" },
  sep: { name: "SEP", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Secretar%C3%ADa_de_Educaci%C3%B3n_P%C3%BAblica_%28M%C3%A9xico%29_logo.svg" },
};

export const COMPANIES = [
  {
    id: "marketpro",
    name: "Market Pro",
    role: "Analista Sr.",
    period: "04/2026 – actual",
    logo: "assets/logos/marketpro.png",
    interactive: true,
    bullets: [
      "Gestión de Datos Maestros: soporte a los dashboards en Google Looker de una de las cuentas principales con operación de promotoría. Depuración y optimización de la información para su funcionamiento en la plataforma actual y migración a Power BI de cada módulo, innovando en nuevos análisis y crecimiento interactivo del análisis.",
      "Gestión de Proyectos: optimización de los KPIs actuales para mejorar tiempos de entrega y visualización de información, creando SharePoints colaborativos para la mejora en entrega de archivos y planes de trabajo.",
    ],
    achievements: [],
  },
  {
    id: "jugosdelvalle",
    name: "Jugos del Valle Santa Clara",
    role: "Analista (2 años) y Coordinador de Soporte Operativo (+3 años)",
    period: "02/2020 – 08/2025",
    logo: "assets/logos/jugosdelvalle.svg",
    interactive: true,
    bullets: [
      "Gestión de Datos Maestros: administración de datos maestros en SAP y Qs3 para cubicaje y programación de viajes.",
      "Estandarización Operativa: creación y autorización de normativas de estiba, armado de tarimas y procesos de carga. Intervención en el flujo de datos en la creación de nuevos SKU, tiendas, CEDIS, etc.",
      "Gestión de Proyectos: control de cronogramas y KPIs para asegurar el cumplimiento de plazos y objetivos (cálculo de bonificaciones y sueldo variable, gestión de proyectos en Centros de Distribución).",
      "Continuidad Operativa: desarrollo de herramientas de contingencia con TI y aplicación de metodología 5S para reducir riesgos. Auditor Jr. de ISOs integrados.",
      "Administración: gestión de servicios de instalaciones, órdenes de compra y soporte ejecutivo multiárea.",
    ],
    achievements: [
      "Como Auditor 5S y Auditor interno de ISOs, obtuve una comprensión profunda de los datos que se tradujo en mejoras tangibles: optimicé flujos de proyectos, depuré catálogos, maximicé la ocupación del transporte y optimicé la programación de viajes para cumplir los tiempos de cada cliente.",
      "Configuré la aplicación principal para la logística de envío de producto, sincronizando en una sola plataforma lo que antes se llevaba en dos, optimizando recursos.",
    ],
  },
  {
    id: "hp",
    name: "HP",
    role: "Administrador en Sitio / Operador de Impresión (en sitio: Jugos del Valle Santa Clara)",
    period: "12/2017 – 02/2020",
    logo: "assets/logos/hp.svg",
    interactive: true,
    bullets: [
      "Control Financiero: administración de presupuestos, prorrateo de facturas y optimización de recursos para reducir costos.",
      "Eficiencia Operativa: implementación de software y mejora de procesos administrativos para maximizar el rendimiento del sitio.",
      "Mantenimiento: punto de contacto para servicios de instalaciones, inspecciones de equipos y coordinación de reparaciones.",
      "Sustentabilidad: supervisión de eliminación de residuos mediante programas de reciclaje certificados.",
    ],
    achievements: [
      "Reduje riesgos operativos y de costos para el cliente optimizando la plantilla de equipos: en el levantamiento inicial se habían solicitado equipos de menor capacidad que hubiesen ocasionado fallos y deterioro inmediato de la flotilla; con visualización integral se adquirió la flotilla adecuada.",
      "Configuré los scripts iniciales para la instalación fácil incluso desde correo, maximizando los tiempos de respuesta.",
    ],
  },
  {
    id: "remolquesutility",
    name: "Remolques Utility",
    role: "Soporte Técnico y Administrativo",
    period: "08/2017 – 11/2017",
    logo: "assets/logos/remolquesutility.svg",
    interactive: true,
    bullets: [
      "Soporte Técnico: diagnóstico de fallas, análisis de causa raíz y reparaciones complejas en equipos críticos.",
      "Infraestructura: monitoreo de rendimiento de red y ejecución de actualizaciones de software sin afectar la operación.",
      "Inventarios: gestión optimizada de materiales para garantizar niveles adecuados de respuesta.",
    ],
    achievements: [],
  },
  {
    id: "rydermattel",
    name: "RYDER-MATTEL",
    role: "Encargado de Sistemas (vía ICORRP)",
    period: "11/2016 – 02/2017",
    logo: "assets/logos/ryder.svg",
    secondaryLogo: {
      name: "Mattel",
      logo: "assets/logos/mattel.svg",
    },
    interactive: true,
    bullets: [
      "Infraestructura IT: administración de servidores, redes, conmutadores y migración de sistemas.",
      "Gestión Logística: supervisión del movimiento de equipos informáticos para evitar déficits operativos.",
      "Seguridad de Datos: implementación de políticas de respaldo, retención de datos y mejores prácticas de soporte.",
    ],
    achievements: [
      "Migración de servidores, cambio físico y configuración de todos los servicios de forma exitosa.",
      "Mejora en servicios de infraestructura configurando Hand Helds y nodos de red adicionales que, en sentido de urgencia, no estaban contemplados, ayudando a la compañía a sostener la operación.",
    ],
  },
  {
    id: "lexmark",
    name: "Lexmark",
    role: "Soporte Técnico Administrador (vía Adsourcing, cliente Nacional Monte de Piedad)",
    period: "02/2014 – 11/2016",
    logo: "assets/logos/lexmark.svg",
    interactive: true,
    bullets: [
      "Capacitación: formación de nuevos técnicos en procedimientos estándar y métodos de operación para clientes.",
      "Optimización: reducción de tiempos de respuesta mediante protocolos de solución priorizada y plataformas de rastreo.",
      "Mantenimiento Preventivo: ejecución de diagnósticos detallados para aumentar la vida útil del equipo y reducir tiempos muertos.",
    ],
    achievements: [
      "Sentido de urgencia y optimización de procesos para la entrega de insumos y atención a emergencias, diagnosticando y reparando en sitio en toda el área metropolitana cuando era crítico para la continuidad del negocio.",
      "Mejora de perfiles de usuarios para una mejor gestión de servicios de impresión, creando nuevos perfiles.",
    ],
  },
  {
    id: "ica",
    name: "Ingeniería en Cómputo y Aplicaciones (ICA)",
    role: "Soporte Técnico",
    period: "02/2011 – 05/2013",
    logo: "",
    initials: "ICA",
    interactive: true,
    clients: ["imss", "cfe", "sep"],
    bullets: [
      "Reparación Especializada: diagnóstico de sistemas eléctricos y mecánicos.",
      "Asesoría: consultoría técnica para equipos de gestión de proyectos en el sector público.",
    ],
    achievements: [],
  },
  {
    id: "cemybs",
    name: "CEMyBS",
    role: "Promotor de Bienestar Social (Gobierno del Edo. de México)",
    period: "04/2007 – 06/2009",
    logo: "",
    initials: "CB",
    note: "CEMyBS (Consejo Estatal de la Mujer y Bienestar Social) fue reestructurado y hoy opera como Secretaría de las Mujeres del Edo. de México.",
    interactive: true,
    bullets: [
      "Logística Social: supervisión de centros de entrega de beneficios y manejo de padrones de programas sociales.",
      "Atención Ciudadana: entrevistas de clasificación socioeconómica y canalización de apoyos a grupos vulnerables.",
    ],
    achievements: [],
  },
];
