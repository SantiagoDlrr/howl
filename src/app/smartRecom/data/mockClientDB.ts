import { FileData } from "../models/types";

export interface ClientEntity {
  id: string;
  name: string;
  companyId: string;
  reports: FileData[];
}

export interface CompanyEntity {
  id: string;
  name: string;
}

export const mockCompanies: CompanyEntity[] = [
  { id: "comp_1", name: "TechNova" },
  { id: "comp_2", name: "Finovate" },
  { id: "comp_3", name: "MediCorp" },
  { id: "comp_4", name: "EduPlus" },
  { id: "comp_5", name: "GreenSpark" },
  { id: "comp_6", name: "RetailPro" },
  { id: "comp_7", name: "HealthEase" },
  { id: "comp_8", name: "SecureNet" },
];

export const mockClients: ClientEntity[] = [
  {
    id: "c_1",
    name: "Juan Pérez",
    companyId: "comp_1",
    reports: [
      {
        id: 101,
        name: "juan_call_1.mp3",
        date: "2025-05-10",
        type: "audio",
        duration: "6:15",
        report: {
          feedback: "Molesto por errores en facturación.",
          keyTopics: ["factura", "error"],
          emotions: ["enojo", "frustración"],
          sentiment: "Negativo",
          output: "",
          summary: "Cliente frustrado por cobros indebidos.",
          rating: 42,
        },
      },
      {
        id: 102,
        name: "juan_call_2.mp3",
        date: "2025-05-12",
        type: "audio",
        duration: "7:02",
        report: {
          feedback: "Requiere seguimiento urgente.",
          keyTopics: ["seguimiento"],
          emotions: ["preocupación"],
          sentiment: "Neutral",
          output: "",
          summary: "Busca confirmación sobre solución propuesta.",
          rating: 63,
        },
      },
      {
        id: 113,
        name: "juan_call_3.mp3",
        date: "2025-05-14",
        type: "audio",
        duration: "5:50",
        report: {
          feedback: "Pidió reembolso por servicio no usado.",
          keyTopics: ["reembolso", "servicio"],
          emotions: ["molestia"],
          sentiment: "Negativo",
          output: "",
          summary: "Cliente solicita devolución inmediata.",
          rating: 48,
        },
      },
      {
        id: 114,
        name: "juan_call_4.mp3",
        date: "2025-05-16",
        type: "audio",
        duration: "6:40",
        report: {
          feedback: "Agradeció solución efectiva.",
          keyTopics: ["solución", "agradecimiento"],
          emotions: ["alivio"],
          sentiment: "Positivo",
          output: "",
          summary: "Cliente satisfecho con atención recibida.",
          rating: 85,
        },
      },
      {
        id: 115,
        name: "juan_call_5.mp3",
        date: "2025-05-18",
        type: "audio",
        duration: "4:55",
        report: {
          feedback: "Solicitó detalles del contrato.",
          keyTopics: ["contrato", "detalles"],
          emotions: ["curiosidad"],
          sentiment: "Neutral",
          output: "",
          summary: "Busca aclaración sobre términos legales.",
          rating: 70,
        },
      },
    ],
  },
  {
    id: "c_2",
    name: "Ana Gómez",
    companyId: "comp_2",
    reports: [
      {
        id: 103,
        name: "ana_call_1.mp3",
        date: "2025-05-11",
        type: "audio",
        duration: "5:22",
        report: {
          feedback: "Consultó sobre nuevas políticas.",
          keyTopics: ["políticas", "cambios"],
          emotions: ["confusión"],
          sentiment: "Neutral",
          output: "",
          summary: "Necesita mayor claridad en los cambios recientes.",
          rating: 70,
        },
      },
    ],
  },
  {
    id: "c_3",
    name: "Carlos Ruiz",
    companyId: "comp_3",
    reports: [
      {
        id: 104,
        name: "carlos_call_1.mp3",
        date: "2025-05-08",
        type: "audio",
        duration: "4:58",
        report: {
          feedback: "Solicitó información técnica.",
          keyTopics: ["API", "integración"],
          emotions: ["curiosidad"],
          sentiment: "Positivo",
          output: "",
          summary: "Explora funcionalidades nuevas de la plataforma.",
          rating: 88,
        },
      },
    ],
  },
  {
    id: "c_4",
    name: "María López",
    companyId: "comp_4",
    reports: [
      {
        id: 105,
        name: "maria_call_1.mp3",
        date: "2025-05-14",
        type: "audio",
        duration: "6:00",
        report: {
          feedback: "Dudas sobre acceso a plataforma.",
          keyTopics: ["login", "plataforma"],
          emotions: ["confusión"],
          sentiment: "Neutral",
          output: "",
          summary: "Cliente solicita asistencia para entrar.",
          rating: 60,
        },
      },
    ],
  },
  {
    id: "c_5",
    name: "Jorge Castillo",
    companyId: "comp_4",
    reports: [
      {
        id: 106,
        name: "jorge_call_1.mp3",
        date: "2025-05-15",
        type: "audio",
        duration: "4:32",
        report: {
          feedback: "Felicitó el soporte técnico.",
          keyTopics: ["soporte"],
          emotions: ["satisfacción"],
          sentiment: "Positivo",
          output: "",
          summary: "Cliente agradecido por respuesta rápida.",
          rating: 91,
        },
      },
      {
        id: 107,
        name: "jorge_call_2.mp3",
        date: "2025-05-16",
        type: "audio",
        duration: "5:19",
        report: {
          feedback: "Solicitó factura duplicada.",
          keyTopics: ["factura"],
          emotions: ["tranquilidad"],
          sentiment: "Neutral",
          output: "",
          summary: "Cliente espera documento fiscal.",
          rating: 75,
        },
      },
    ],
  },
  {
    id: "c_6",
    name: "Valeria Hernández",
    companyId: "comp_5",
    reports: [
      {
        id: 108,
        name: "valeria_call_1.mp3",
        date: "2025-05-13",
        type: "audio",
        duration: "5:00",
        report: {
          feedback: "Pregunta sobre tarifas nuevas.",
          keyTopics: ["precios", "tarifas"],
          emotions: ["curiosidad"],
          sentiment: "Neutral",
          output: "",
          summary: "Consulta sobre cambios en precios.",
          rating: 68,
        },
      },
    ],
  },
  {
    id: "c_7",
    name: "Pedro Aguilar",
    companyId: "comp_6",
    reports: [
      {
        id: 109,
        name: "pedro_call_1.mp3",
        date: "2025-05-12",
        type: "audio",
        duration: "6:05",
        report: {
          feedback: "Problemas con pedidos recientes.",
          keyTopics: ["logística", "pedido"],
          emotions: ["molestia"],
          sentiment: "Negativo",
          output: "",
          summary: "Cliente enojado por retraso en entrega.",
          rating: 50,
        },
      },
    ],
  },
  {
    id: "c_8",
    name: "Lucía Torres",
    companyId: "comp_6",
    reports: [
      {
        id: 110,
        name: "lucia_call_1.mp3",
        date: "2025-05-13",
        type: "audio",
        duration: "7:10",
        report: {
          feedback: "Muy satisfecha con atención.",
          keyTopics: ["servicio"],
          emotions: ["alegría"],
          sentiment: "Positivo",
          output: "",
          summary: "Cliente feliz con experiencia de compra.",
          rating: 95,
        },
      },
    ],
  },
  {
    id: "c_9",
    name: "Diego Mendoza",
    companyId: "comp_7",
    reports: [
      {
        id: 111,
        name: "diego_call_1.mp3",
        date: "2025-05-10",
        type: "audio",
        duration: "5:44",
        report: {
          feedback: "Consulta médica urgente.",
          keyTopics: ["urgencia", "consulta"],
          emotions: ["ansiedad"],
          sentiment: "Negativo",
          output: "",
          summary: "Solicita asistencia médica inmediata.",
          rating: 45,
        },
      },
    ],
  },
  {
    id: "c_10",
    name: "Andrea Ríos",
    companyId: "comp_8",
    reports: [
      {
        id: 112,
        name: "andrea_call_1.mp3",
        date: "2025-05-11",
        type: "audio",
        duration: "5:20",
        report: {
          feedback: "Consultó sobre privacidad de datos.",
          keyTopics: ["privacidad", "datos"],
          emotions: ["preocupación"],
          sentiment: "Neutral",
          output: "",
          summary: "Solicita garantías de seguridad de la info.",
          rating: 73,
        },
      },
    ],
  },
];
