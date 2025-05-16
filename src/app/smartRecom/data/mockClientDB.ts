// src/app/smartRecom/data/mockClientDB.ts
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
];
