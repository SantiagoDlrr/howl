# HowlX - Improving Customer Service with AI

# Introduction

This repository contains the development of the project related to the "Platform for Improving Customer Service" within the Digital Consulting area of NEORIS. The focus of the project is to design a **Web App** that allows visualizing and analyzing customer conversations, transcribing in real-time, analyzing emotions, detecting key topics, and generating reports with relevant metrics.

### Objectives

Develop a platform that allows:
- Analyzing customer service calls.
- Evaluating customer satisfaction through emotion analysis.
- Generating real-time call transcriptions.
- Providing reports with key metrics.
- Implementing filters to facilitate information search and analysis.

### Key Features

- **Call Recording**:
  - Real-time transcription of calls.
  - Emotion analysis and key topic detection.
  - Voice differentiation in calls.
- **Report Generation**:
  - Call-specific reports.
  - Transcription of calls.
  - Metrics and analysis.
  - Global report with filters by date, sector, consultant, client.
- **Integrations**:
  - **Microsoft Graph API** for Teams integration and automatic recording extraction.
  - **Webhooks** for process automation.
  - **Database connections** PostgreSQL for data storage and Pinecone for embeddings.



# Tech Overview

## AI and Machine Learning Technologies

- **STT (Speech-to-Text)**: Conversion of audio to text.
- **NLP (Natural Language Processing)**: Text processing and analysis.
- **Embeddings**: Extraction of vector representations for semantic searches.
- **Statistics**: Analysis of metrics and efficiency in calls.

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, Typescript.
- **Backend**: Node.js, tRPC, Prisma, Typescript.
- **AI Backend**: Python, FastAPI.
- **iOS Application**: Swift, SwiftUI, AVFoundation.
- **Database**: PostgreSQL.
- **Deployment**: Vercel, Docker, Aiven, Sandbox.

## Models Used

- **WHISPER**: Advanced voice recognition, multilingual support.
- **KeyBERT**: Keyword extraction using BERT.
- **PyAnnotate**: Voice differentiation in audio.
- **Pinecone**: Semantic search based on embeddings.

## Architecture 
![Architecture Diagram](/docs/architecture/Diagram.png)
[Full view](https://github.com/SantiagoDlrr/howl/tree/main/docs/architecture/Diagram.png)

# Deployments and links
  
- [Webapp Deployment](https://howl-eight.vercel.app/)
- [Sanbox Deployment (AI backend)](https://howlx.adriangaona.dev/)
- [AI backend repo](https://github.com/SantiagoDlrr/python-howl)
- [Demo video](https://www.youtube.com/watch?v=prt349ptWsQ)
- [Technical test](https://github.com/jadrianlg16/SER_web_prototype)


# Development Team
- **Alejandra Coeto Sánchez**
- **Diego de Jesús Esparza Ruiz**
- **Jesús Adrián López Gaona**
- **Luis Gerardo Juárez García**
- **Mónica Soberón Zubía**
- **Santiago De la Riva Juárez**

