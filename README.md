# README - Proyecto: Plataforma de Análisis de Conversaciones
## Introducción
Este repositorio contiene el desarrollo del proyecto relacionado con la "Plataforma para la mejora de Atención al Cliente" dentro del área de Digital Consulting de NEORIS. El objetivo del proyecto es diseñar una **Web App** que permita visualizar y analizar conversaciones de clientes, transcribir en tiempo real, analizar emociones, detectar temas clave y generar reportes con métricas relevantes.
## Equipo de Trabajo
- **Alejandra Coeto Sánchez**
- **Diego de Jesús Esparza Ruiz**
- **Jesús Adrián López Gaona**
- **Luis Gerardo Juárez García**
- **Mónica Soberón Zubía**
- **Santiago De la Riva Juárez**
## Objetivo del Proyecto
Desarrollar una plataforma que permita:
- Analizar llamadas de servicio al cliente.
- Evaluar la satisfacción del cliente mediante análisis de emociones.
- Generar transcripciones de llamadas en tiempo real.
- Proporcionar reportes con métricas clave.
- Implementar filtros para facilitar la búsqueda y análisis de información.
## Tecnologías Investigadas
- **STT (Speech-to-Text)**: Conversión de audio a texto.
- **NLP (Natural Language Processing)**: Procesamiento y análisis de texto.
- **Embeddings**: Extracción de representaciones vectoriales para búsquedas semánticas.
- **Estadística**: Análisis de métricas y eficiencia en llamadas.
## Tecnologías Evaluadas para la Implementación
### Modelos de Machine Learning
- **WHISPER (OpenAI)**: Reconocimiento de voz avanzado, soporte multilingüe.
- **KeyBERT**: Extracción de palabras clave utilizando BERT.
- **PyAnnotate**: Diferenciación de voces en un audio.
- **Pinecone**: Búsqueda semántica basada en embeddings.
## Funcionalidades Principales
- **Captura y análisis de conversaciones**:
  - Transcripción en tiempo real.
  - Análisis de emociones y detección de temas clave.
  - Diferenciación de voces en las llamadas.
- **Generación de reportes**:
  - Reporte por llamada.
  - Transcripción de llamada.
  - Métricas y análisis.
  - Reporte global con filtros por fecha, sector, consultor, cliente.
- **Integraciones**:
  - **Microsoft Graph API** para integración con Teams y extracción automática de grabaciones.
  - **Webhooks** para automatización de procesos.
  - **Conexión con bases de datos** como MongoDB o SQL para almacenamiento de datos y embeddings.



## Prueba tecnica:
- https://github.com/jadrianlg16/SER_web_prototype
  



# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
