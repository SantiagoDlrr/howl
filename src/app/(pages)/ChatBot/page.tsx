"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ArrowUp } from "lucide-react"
import Image from "next/image"

export default function HowlAIPage() {
  const { data: session } = useSession()
  const [inputValue, setInputValue] = useState("")
  const [respuestaIA, setRespuestaIA] = useState("")
  const [cargando, setCargando] = useState(false)
  const userName = session?.user?.name || "Usuario"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setCargando(true)
    setRespuestaIA("")

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Por favor, responde en español a la siguiente consulta: ${inputValue}` }),
      })

      const data = await response.json()
      setRespuestaIA(data.resultado || "No se obtuvo respuesta de la IA.")
    } catch (error) {
      setRespuestaIA("Hubo un error al consultar la IA.")
    } finally {
      setCargando(false)
      setInputValue("")
    }
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

        {/* Tarjetas de opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-gray-200 rounded-lg p-6 hover:bg-violet-100 transition-colors cursor-pointer">
            <h3 className="text-lg font-medium text-gray-700">Perfil de Cliente</h3>
            <p className="text-sm text-gray-600 opacity-80">Recuérdame los detalles del cliente Roberto.</p>
          </div>

          <div className="bg-gray-200 rounded-lg p-6 hover:bg-violet-100 transition-colors cursor-pointer">
            <h3 className="text-lg font-medium text-gray-700">Análisis de Conversaciones</h3>
            <p className="text-sm text-gray-600 opacity-80">Resúmeme los temas clave recientes.</p>
          </div>
        </div>

        {/* Campo de entrada */}
        <div className="mt-8">
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
              disabled={cargando}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-violet-500 text-white p-2 rounded-lg hover:bg-violet-400 transition-colors"
            >
              <ArrowUp size={20} />
            </button>
          </form>
        </div>

        {/* Respuesta de la IA */}
        {cargando ? (
          <div className="mt-6 text-center text-violet-600">Pensando...</div>
        ) : respuestaIA ? (
          <div className="mt-6 bg-white p-6 rounded-lg shadow text-gray-800">
            <h4 className="font-semibold mb-2">Respuesta de Howl AI:</h4>
            <p>{respuestaIA}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}