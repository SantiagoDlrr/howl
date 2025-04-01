import Image from "next/image";

export default function PlaceholderView({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        onClick={onUploadClick}
        className="flex flex-col items-center border-black border-opacity-50 border-dashed border-2 py-20 px-24 cursor-pointer"
      >
        <Image src="/images/uploadc.png" alt="Upload icon" width={75} height={50} />
        <h1 className="text-4xl font-bold text-purple-600 mt-4">
          Analiza y Transcribe tu archivo
        </h1>
        <p className="text-2xl py-3 text-gray-500">Arrastra o haz click para cargar</p>
      </div>
    </div>
  );
}