import React from 'react';
import { Upload } from 'lucide-react';
import Recording from './recording';
import LoadAction from './loadAction';
import { FaMicrophone } from "react-icons/fa";
interface Props {
  onUpload: () => void;
  onRecord: () => void;
  close?: () => void;
}

export const EmptyState: React.FC<Props> = ({ onUpload, onRecord, close }) => {
  const handleUpload = () => {
    onUpload();
    close && close();
  };
  const handleRecord = () => {
    onRecord();
    close && close();
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 ">
      <div className="text-center  w-full">
        {/* <Recording /> */}
        <h2 className="text-2xl font-semibold text-purple-600 mb-4">¡Bienvenido a HowlX!</h2>

        <div className='flex flex-row gap-10 items-center justify-center'>
          <div className="flex-1">
            <LoadAction
              onClick={handleRecord}
              title="Graba y analiza tu llamada"
              label="Empieza una nueva grabación"
              buttonLabel="Graba"
              icon={FaMicrophone}
            />
          </div>
          <div className="flex-1">
            <LoadAction
              onClick={handleUpload}
              title="Analiza y transcribe tu archivo"
              label="Arrastra o haz click para cargar"
              buttonLabel="Cargar archivo"
              icon={Upload}
            />
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Aún no tienes ninguna llamada cargada
        </p>
      </div>
    </div>
  );
};