import { auth } from "howl/server/auth"
import { api, HydrateClient } from "howl/trpc/server"
import LandingSection from "./_components/landing/landingSection"

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();
  if (session?.user) {
    void api.post.getLatest.prefetch()
    
  }

  return (
    <HydrateClient>
      <LandingSection />
      <div className="bg-bg-dark min-h-screen p-20">
        <h1 className="text-3xl font-bold">
          Mejorando el <span className="text-primary">servicio al cliente</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Reportes</h2>

            <div className="border rounded-lg overflow-hidden mb-8">
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-base font-medium flex items-center">
                      Facturación Incorrecta
                      <span className="ml-1 text-gray-400 text-xs">↗</span>
                    </h3>
                    <p className="text-xs text-gray-500">Reporte de Llamada · 13 de Marzo · <span className="underline">7 min</span></p>
                  </div>
                  <div>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Soporte Técnico</span>
                  </div>
                </div>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">Calificación: <span className="font-medium">80</span></span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-purple-400 text-white p-1 rounded w-6 h-6 flex items-center justify-center">
                      <span className="text-xs">+</span>
                    </div>
                    <span className="text-xs font-medium">Feedback</span>
                    <span className="text-xs text-gray-500">6 comentarios</span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    El agente atendió la llamada de manera cortés y resolvió una actitud profesional durante toda la interacción. Detectó errores, se mostró receptivo y ofreció una respuesta rápida al problema planteado por el cliente. Sin embargo, un lapso de olvido de información relevante generó una pequeña confusión. La actitud de servicio que tomará de nuevo al resolverlo. Aunque sus acciones en el procedimiento inicial, pudo haber explicado otras alternativas inmediatas que evaluar a través del cliente. A pesar de este detalle, la llamada en general con eficacia y el cliente recibió una respuesta clara sobre el proceso a seguir.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Creación automatizada de reportes por cada llamada:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generación de transcript</li>
                <li>Extracción de métricas, palabras clave y temas</li>
                <li>Análisis de sentimientos</li>
              </ul>
            </div>
          </div>
          {/* Análisis de datos */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Análisis de datos</h2>

            <div className="border border-blue-200 rounded-lg overflow-hidden mb-8">
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-base font-medium flex items-center">
                      Facturación Incorrecta
                      <span className="ml-1 text-gray-400 text-xs">↗</span>
                    </h3>
                    <p className="text-xs text-gray-500">Reporte de Llamada · 13 de Marzo · <span className="underline">7 min</span></p>
                  </div>
                  <div>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Soporte Técnico</span>
                  </div>
                </div>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">Calificación: <span className="font-medium">80</span></span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-purple-400 text-white p-1 rounded w-6 h-6 flex items-center justify-center">
                      <span className="text-xs">+</span>
                    </div>
                    <span className="text-xs font-medium">Feedback</span>
                    <span className="text-xs text-gray-500">6 comentarios</span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    El agente atendió la llamada de manera cortés y resolvió una actitud profesional durante toda la interacción. Detectó errores, se mostró receptivo y ofreció una respuesta rápida al problema planteado por el cliente. Sin embargo, un lapso de olvido de información relevante generó una pequeña confusión. La actitud de servicio que tomará de nuevo al resolverlo. Aunque sus acciones en el procedimiento inicial, pudo haber explicado otras alternativas inmediatas que evaluar a través del cliente. A pesar de este detalle, la llamada en general con eficacia y el cliente recibió una respuesta clara sobre el proceso a seguir.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">
                Colección de información más relevante. Gráficas al paso del tiempo, por cliente y por emleado.
                Visualización de métricas.
              </h3>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Ai Assistant</h2>

            <div className="border border-purple-200 rounded-lg overflow-hidden mb-8">
              <div className="p-6 flex flex-col items-center">
                <div className="text-purple-500 mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <p className="font-medium text-sm mb-1">Hola, Héctor 👋</p>
                <p className="text-xs mb-4">¿Qué haremos el día de hoy?</p>

                <div className="w-full bg-gray-100 p-2 rounded text-xs text-gray-400 mb-4 text-center">
                  Haz una pregunta o busca información...
                </div>

                <div className="w-full flex justify-between items-center text-xs">
                  <div className="text-gray-500">Análisis Diario</div>
                  <div className="text-gray-500">Análisis de Conversación</div>
                  <div className="bg-purple-100 rounded-full p-1 text-purple-500">
                    <span>+</span>
                  </div>
                </div>

                <div className="mt-8 w-full flex justify-between">
                  <div className="text-xs text-gray-400">Análisis de Llamada</div>
                  <div className="text-xs text-gray-400">Análisis de Conversación</div>
                  <div className="bg-purple-100 rounded-full w-5 h-5 flex items-center justify-center text-purple-500 text-xs">
                    <span>+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">
                Asistente para realizar preguntas o encontrar información de todas las llamadas.
              </h3>
            </div>
          </div>
        </div>
        {/*Cómo usar HowlX */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold mb-16">¿Cómo usar HowlX?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-16">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-purple-400 text-white w-8 h-8 rounded-lg flex items-center justify-center">1</span>
                  <h3 className="text-xl font-medium">Sube el archivo de la llamada.</h3>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-12 h-12 text-purple-400 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16L12 8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 15V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <p className="text-purple-400 font-medium mb-1">Analiza y Transcribe tu archivo</p>
                    <p className="text-sm text-gray-500">Arrastra o haz click para cargar</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-purple-400 text-white w-8 h-8 rounded-lg flex items-center justify-center">3</span>
                  <h3 className="text-xl font-medium">Realiza preguntas</h3>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="text-sm font-medium">Héctor, RG2</p>
                      <p className="text-xs text-gray-500">Howl AI, redacta un correo de seguimiento</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Claro! Aquí tienes un correo de seguimiento basado en el reporte de la llamada:</p>
                      </div>
                    </div>
                    <button className="bg-purple-100 p-2 rounded-lg">
                      <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-16">
              {/* Paso 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-purple-400 text-white w-8 h-8 rounded-lg flex items-center justify-center">2</span>
                  <h3 className="text-xl font-medium">Visualiza el reporte</h3>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Facturación Incorrecta ↗</h4>
                      <p className="text-sm text-gray-500">Reporte de Llamada · 13 de Marzo · <span className="underline">7 min</span></p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Soporte Técnico</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-400 text-white w-6 h-6 rounded flex items-center justify-center text-sm">+</span>
                      <span className="text-sm font-medium">Feedback</span>
                      <span className="text-xs text-gray-500">6 comentarios</span>
                    </div>
                    <p className="text-sm text-gray-600">El agente atendió la llamada de manera cortés...</p>
                  </div>
                </div>
              </div>

              {/* Paso 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-purple-400 text-white w-8 h-8 rounded-lg flex items-center justify-center p-3">4</span>
                  <h3 className="text-xl font-medium">Obtén visualización de datos y recomendaciones usando la información de todas las llamadas</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
      </Link>
      <Link className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20" href="https://create.t3.gg/en/introduction" target="_blank" >
      <h3 className="text-2xl font-bold">Documentation →</h3>
      <div className="text-lg">
      Learn more about Create T3 App, the libraries it uses, and how
      to deploy it.
      </div>
      </Link>
      </div>
      <div className="flex flex-col items-center gap-2">
      <p className="text-2xl text-white">
      {hello ? hello.greeting : "Loading tRPC query..."}
      </p>

      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {session && <span>Logged in as {session.user?.name}</span>}
        </p>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>
      </div>

      {session?.user && <LatestPost />}
      </div>
      </main> */}
    </HydrateClient>
  )
}