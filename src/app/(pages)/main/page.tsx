import SignUpCard from "howl/app/_components/auth/signupCard";
import Button from "../../_components/button"
import Image from "next/image"

export default function mainPage (){

    return(
        <div className="h-[calc(100vh-73px)] w-[1512px] flex justify-center items-stretch pt-20">

            <div className= "flex flex-col flex-[2.1]">
               
               <div className="border-black border-opacity-50 border-t border-b border-r-0 border-2 p-3">
                Historial de Llamadas
               </div>


               <div className="flex flex-col justify-between flex-1 p-6 ">

                <div>
                    <Button label="+ Agregar Nueva Llamada" xl secondary />


                    <div className="mt-6 mb-3 font-bold">
                        Hoy
                    </div>

                    <div className="bg-purple-400 bg-opacity-30 rounded p-2">
                        Neoris - venta - ene 16
                    </div>

                    <div className="p-2 mt-2">
                        Cliente - Categoria - Fecha 
                    </div>

                </div>

                <Button label="Guardar llamadas en el Log" xl></Button>

               </div>

            </div>

             
            <div className="flex flex-col flex-[5.8] h-full border-black border-opacity-50 border-t border-b-0 border-r border-l border-2">

                <div className="border-black border-opacity-50 border-t-0 border-b border-r-0 border-l-0 border-2 p-3">
                Análisis de Llamada
               </div>

               <div className="flex justify-center items-center flex-1">
                    <div className="flex flex-col items-center border-black border-opacity-50 border-dashed border-2 py-20 px-24">
                        <Image src="/images/uploadc.png" alt="Microsoft Logo" width={75} height={50} />
                        <h1 className="text-4xl font-bold text-primary">
                            Analiza y Transcribe tu archivo
                        </h1>
                        <p className="text-2xl py-3">Arrastra o haz click para cargar</p>
                    </div>
               </div>
        
            </div>
            
            <div className="border-black border-2 border-opacity-30 flex flex-[2.1]">Ai Asistant</div>

        </div>
    );
}