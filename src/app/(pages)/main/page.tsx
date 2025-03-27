import SignUpCard from "howl/app/_components/auth/signupCard";

export default function mainPage (){

    return(
        <div className="min-h-[calc(100vh-73px)] min-w-[1512px] flex justify-center items-stretch pt-20">

            <div className="border-black border-2 opacity-50 flex flex-col flex-[2.1]">
               
               <div className="border-black border-2 p-3">
                Historial de LLamadas
               </div>


               <div className="flex flex-col justify-between h-full p-6 ">

                <div>
                    <button>
                        + Agregar nueva llamada
                    </button>

                    <div className="mt-6">
                        Hoy
                    </div>

                    <div>
                        Neoris - venta - ene 16
                    </div>

                </div>

                <button>
                    Guardar llamadas en el Log
                </button>

               </div>

            </div>

            <div className="border-black border-2 opacity-50 flex flex-[5.8]">Report</div>
            
            <div className="border-black border-2 opacity-50 flex flex-[2.1]">Ai Asistant</div>

        </div>
    );
}