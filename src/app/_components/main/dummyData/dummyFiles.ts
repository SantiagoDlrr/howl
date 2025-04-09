import type { FileData } from "@/app/types/main";

export const generateDummyFiles = (): FileData[] => [
  {
    id: 1,
    name: 'Problema con el Envío',
    date: '01/04/2025',
    type: 'Logística',
    duration: '12 min',
    rating: 70,
    report: {
      feedback: 'El cliente reporta que su paquete no ha llegado a tiempo.',
      keyTopics: ['Retraso en envío', 'Seguimiento de paquetes'],
      emotions: ['1. Frustración', '2. Inquietud', '3. Agradecimiento'],
      sentiment: 'Negativo - Neutro',
      output: 'Se abrió un ticket de seguimiento con paquetería.',
      riskWords: 'El cliente amenazó con cancelar su suscripción.',
      summary: 'El cliente llamó por un paquete que lleva 5 días de retraso. Se ofreció seguimiento y descuento.',
    },
    transcript: [
      { speaker: 'Sandra', text: 'Buenas tardes, ¿en qué puedo ayudarte?' },
      { speaker: 'Luis', text: 'Mi pedido no ha llegado, y ya pasaron varios días.' },
      { speaker: 'Sandra', text: 'Lamento mucho la demora, ¿puedes darme tu número de orden para verificar el estatus?' },
      { speaker: 'Luis', text: 'Claro, es el 563291. Lo pedí hace una semana y decía que llegaba en 2 días.' },
      { speaker: 'Sandra', text: 'Gracias. Estoy revisando... veo que hubo un problema con la paquetería, parece que está retenido en el centro de distribución.' },
      { speaker: 'Luis', text: '¿Y nadie me avisó? Esto es muy frustrante, necesito ese paquete urgentemente.' },
      { speaker: 'Sandra', text: 'Tienes toda la razón. Vamos a abrir un ticket para darle seguimiento inmediato. También puedo ofrecerte un cupón del 10% por las molestias.' },
      { speaker: 'Luis', text: 'Ok... al menos eso ayuda. Pero si no llega mañana, voy a cancelar la suscripción.' },
      { speaker: 'Sandra', text: 'Lo entiendo, haremos todo lo posible para resolverlo hoy mismo. Te mantendremos informado por correo.' },
      { speaker: 'Luis', text: 'Gracias. Espero noticias pronto.' },
    ]
  },
  {
    id: 2,
    name: 'Consulta sobre Factura Electrónica',
    date: '30/03/2025',
    type: 'Administración',
    duration: '9 min',
    rating: 85,
    report: {
      feedback: 'El cliente tenía dudas sobre la emisión de su CFDI.',
      keyTopics: ['Facturación', 'SAT', 'Datos fiscales'],
      emotions: ['1. Curiosidad', '2. Confusión'],
      sentiment: 'Neutro',
      output: 'Se explicó el proceso y se reenvió la factura.',
      riskWords: 'El cliente mencionó posibles errores fiscales.',
      summary: 'Llamada corta donde se aclaró el proceso de facturación digital.',
    },
    transcript: [
      { speaker: 'Carlos', text: '¿Cómo puedo obtener mi factura? No la encuentro en el correo.' },
      { speaker: 'Agente', text: 'Con gusto, necesito tus datos fiscales primero para buscarla en el sistema.' },
      { speaker: 'Carlos', text: 'Mi RFC es CACR890112H23 y el correo es carlos@email.com.' },
      { speaker: 'Agente', text: 'Gracias, confirmando... sí, tu compra fue el 28 de marzo. ¿Podrías confirmar el monto total, por favor?' },
      { speaker: 'Carlos', text: 'Fueron $849.50. ¿Está bien?' },
      { speaker: 'Agente', text: 'Perfecto, ya localicé la factura. Parece que hubo un error al enviarla, pero ya la estoy reenviando a tu correo.' },
      { speaker: 'Carlos', text: 'Ok, ¿tiene validez fiscal? Es para declararla.' },
      { speaker: 'Agente', text: 'Sí, es un CFDI válido ante el SAT. También te enviaré el XML por si lo necesitas.' },
      { speaker: 'Carlos', text: 'Perfecto, gracias por tu ayuda.' },
    ]
  },
  {
    id: 3,
    name: 'Sugerencia sobre Funcionalidad Nueva',
    date: '28/03/2025',
    type: 'Finanzas',
    duration: '5 min',
    rating: 95,
    report: {
      feedback: 'El cliente propuso una mejora en la app.',
      keyTopics: ['UX', 'Funcionalidades nuevas'],
      emotions: ['1. Entusiasmo'],
      sentiment: 'Positivo',
      output: 'Se documentó la sugerencia para revisión del equipo de producto.',
      riskWords: 'Ninguna',
      summary: 'El cliente dio una sugerencia sobre agregar notificaciones personalizadas.',
    },
    transcript: [
      { speaker: 'Clienta', text: '¡Amo la app! Es muy útil, pero creo que le falta una opción para configurar alertas según mis metas de ahorro.' },
      { speaker: 'Soporte', text: '¡Gracias por tu comentario! ¿Podrías contarme un poco más de cómo imaginas esas alertas?' },
      { speaker: 'Clienta', text: 'Claro, por ejemplo: que me avise si gasto más de cierto monto en comida, o que me recuerde transferir a mi cuenta de ahorro cada viernes.' },
      { speaker: 'Soporte', text: '¡Muy buena idea! Lo anoto como sugerencia para el equipo de producto. Nos encanta recibir este tipo de propuestas.' },
      { speaker: 'Clienta', text: '¡Genial! Me encantaría ver eso en la próxima actualización.' },
      { speaker: 'Soporte', text: 'Esperamos poder implementarlo pronto. ¡Gracias por usar la app y por tu entusiasmo!' },
    ]
  }
];