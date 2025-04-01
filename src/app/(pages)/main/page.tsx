import SignUpCard from "howl/app/_components/auth/signupCard";
import Button from "../../_components/button"
import CallLog from "howl/app/_components/main_page/callLog";
import Image from "next/image"
import DocumentPanel from "howl/app/_components/main_page/panels/documentPanel";

export default function mainPage (){

    return(
        <div className="h-[calc(100vh-73px)] flex justify-center items-stretch pt-20">

            
            <CallLog /> 

            
            <DocumentPanel />
            



            <div className="border-black border-2 border-opacity-30 flex flex-[2.1] h-full">Ai Asistant</div>

        </div>
    );
}