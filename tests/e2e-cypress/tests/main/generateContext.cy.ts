// cypress/e2e/unit/generateContext.cy.ts
import { generateContext } from "@/app/utils/generateContext";
import type { Report, TranscriptEntry } from "@/app/utils/types/main";

describe('generateContext', () => {
  it('debería generar contexto con todos los campos del reporte', () => {
    const report: Report = {
      feedback: "Muy buena atención",
      keyTopics: ["SAP", "Google Cloud"],
      emotions: ["Tranquilo", "Satisfecho"],
      sentiment: "Positivo",
      output: "Cliente satisfecho con el soporte.",
      riskWords: ["cancelación", "insatisfacción"],
      summary: "Llamada enfocada en resolver dudas técnicas.",
      rating: 5,
    };

    const transcript: TranscriptEntry[] = [
      { speaker: "Carlos", text: "Hola, Ángel." },
    ];

    const result = generateContext(report, transcript);
    cy.wrap(result).should('include', 'Muy buena atención');
    cy.wrap(result).should('include', 'SAP, Google Cloud');
    cy.wrap(result).should('include', 'Carlos: Hola, Ángel.');
  });

  it('debería manejar reporte null sin fallar', () => {
    const result = generateContext(null, []);
    cy.wrap(result).should('include', 'No disponible');
  });

  it('debería mostrar "Ninguno" si no hay keyTopics', () => {
    const report: Report = {
      feedback: "Todo bien",
      keyTopics: [],
      emotions: [],
      sentiment: "",
      output: "",
      riskWords: [],
      summary: "",
      rating: 4,
    };

    const result = generateContext(report, []);
    cy.wrap(result).should('include', '🧹 Temas clave tratados:');
    cy.wrap(result).should('include', 'Ninguno');
  });

//   it('debería cortar la transcripción si es muy larga', () => {
//     const transcript: TranscriptEntry[] = Array(100).fill({ speaker: "Bot", text: "Mucha info" });
//     const result = generateContext(null, transcript);
//     cy.wrap(result).invoke('length').should('be.lessThan', 2100);
//   });

  it('debería mostrar "Desconocido" si falta speaker', () => {
    const transcript: TranscriptEntry[] = [{ speaker: undefined as any, text: "Hola" }];
    const result = generateContext(null, transcript);
    cy.wrap(result).should('include', 'Desconocido: Hola');
  });
});