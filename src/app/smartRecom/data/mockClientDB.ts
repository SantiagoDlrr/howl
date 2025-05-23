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
        client_name: "Juan Pérez",
        id: 101,
        name: "juan_call_1.mp3",
        date: new Date("2025-05-10"),
        type: "audio",
        duration: 500,
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
        client_name: "Juan Pérez",
        id: 102,
        name: "juan_call_2.mp3",
        date: new Date("2025-05-12"),
        type: "audio",
        duration: 300,
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
        client_name: "Juan Pérez",
        id: 113,
        name: "juan_call_3.mp3",
        date: new Date("2025-05-14"),
        type: "audio",
        duration: 300,
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
        client_name: "Juan Pérez",
        id: 114,
        name: "juan_call_4.mp3",
        date: new Date("2025-05-16"),
        type: "audio",
        duration: 400,
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
        client_name: "Juan Pérez",
        id: 115,
        name: "juan_call_5.mp3",
        date: new Date("2025-05-18"),
        type: "audio",
        duration: 200,
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
];
