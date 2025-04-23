"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ArrowUp } from "lucide-react"
import Image from "next/image"

// Definimos un tipo para los mensajes
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function HowlAIPage() {
  const { data: session } = useSession()
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [cargando, setCargando] = useState(false)
  const userName = session?.user?.name || "Usuario"
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Función para desplazarse al final de la conversación
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Desplazarse al final cuando se añaden nuevos mensajes
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Crear un ID único para el mensaje
    const messageId = Date.now().toString()
    
    // Añadir el mensaje del usuario al historial
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content: inputValue,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setCargando(true)
    setInputValue("")

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Por favor, responde en español a la siguiente consulta: ${inputValue}` }),
      })

      const data = await response.json()
      
      // Añadir la respuesta del asistente al historial
      const assistantMessage: Message = {
        id: messageId + "-response",
        role: "assistant",
        content: data.resultado || "No se obtuvo respuesta de la IA.",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      // Añadir mensaje de error al historial
      const errorMessage: Message = {
        id: messageId + "-error",
        role: "assistant",
        content: "Hubo un error al consultar la IA.",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setCargando(false)
    }
  }

  // Formatear la hora del mensaje
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="pt-16 flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 text-gray-700">
      <div className="w-full max-w-3xl space-y-8">
        {/* Logo y encabezado */}
        <div className="flex flex-col items-center space-y-4">
          {/* Solo el logo de Howl centrado */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <Image 
                src="/images/logo.png" 
                alt="Howl AI Logo" 
                width={80} 
                height={80}
                className="object-contain"
              />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-medium text-gray-700">Hola, {userName}</h2>
            <h1 className="mt-2 text-4xl font-bold text-gray-800">¿Qué haremos el día de hoy?</h1>
            <p className="mt-3 text-lg text-gray-600 max-w-lg">
              Listo para ayudarte, desde responder preguntas hasta brindar recomendaciones. ¡Comencemos!
            </p>
          </div>
        </div>

        {/* Tarjetas de opciones - Solo mostrar si no hay mensajes */}
        {messages.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div 
              className="bg-gray-200 rounded-lg p-6 hover:bg-violet-100 transition-colors cursor-pointer"
              onClick={() => {
                setInputValue("Recuérdame los detalles del cliente Roberto.");
                // Opcional: enviar automáticamente después de un breve retraso
                setTimeout(() => {
                  const form = document.querySelector('form');
                  form?.dispatchEvent(new Event('submit', { cancelable: true }));
                }, 100);
              }}
            >
              <h3 className="text-lg font-medium text-gray-700">Perfil de Cliente</h3>
              <p className="text-sm text-gray-600 opacity-80">Recuérdame los detalles del cliente Roberto.</p>
            </div>

            <div 
              className="bg-gray-200 rounded-lg p-6 hover:bg-violet-100 transition-colors cursor-pointer"
              onClick={() => {
                setInputValue("Resúmeme los temas clave recientes.");
                // Opcional: enviar automáticamente después de un breve retraso
                setTimeout(() => {
                  const form = document.querySelector('form');
                  form?.dispatchEvent(new Event('submit', { cancelable: true }));
                }, 100);
              }}
            >
              <h3 className="text-lg font-medium text-gray-700">Análisis de Conversaciones</h3>
              <p className="text-sm text-gray-600 opacity-80">Resúmeme los temas clave recientes.</p>
            </div>
          </div>
        )}

        {/* Historial de conversación */}
        {messages.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-3/4 rounded-lg p-3 ${
                      message.role === "user" 
                        ? "bg-violet-100 text-gray-800" 
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="font-semibold text-sm">
                        {message.role === "user" ? userName : "Howl AI"}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {cargando && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-lg p-3 text-gray-800">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold text-sm">Howl AI</span>
                    </div>
                    <p className="text-sm">Pensando...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Campo de entrada */}
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pregúntame Algo..."
              className="w-full py-4 px-6 bg-gray-200 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
            <button
              type="submit"
              disabled={cargando || !inputValue.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg ${
                cargando || !inputValue.trim() 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-violet-500 hover:bg-violet-400"
              } text-white transition-colors`}
            >
              <ArrowUp size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}