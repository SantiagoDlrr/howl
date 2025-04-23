"use client";

import { useState, useRef } from "react";
import { PiRecordFill } from "react-icons/pi";
import { FaRegStopCircle } from "react-icons/fa";
import ToggleButton from "../toggleButton";
import { IoSparklesSharp } from "react-icons/io5";

interface Props {
    onUpload: (file: File) => void; // The parent will handle the actual POST request
    setUploading: (uploading: boolean) => void; // Function to set uploading state
}

const Recording = ({ onUpload, setUploading }: Props) => {
    const [recording, setRecording] = useState(false);
    const [downloadURL, setDownloadURL] = useState<string | null>(null);
    const [selected, setSelected] = useState<number>(1);
    const [captureVideo, setCaptureVideo] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const micChunksRef = useRef<Blob[]>([]);
    const micRecorderRef = useRef<MediaRecorder | null>(null);

    const handleAnalize = () => {
        if (file) {
            setUploading(true);
            onUpload(file);
            // setUploading(false);
            setDownloadURL(null);
            setFile(null);
            setCaptureVideo(false);
            setSelected(1);
        }
    }

    const startRecording = async () => {
        try {
            const audioContext = new AudioContext();
            const destination = audioContext.createMediaStreamDestination();

            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const micSource = audioContext.createMediaStreamSource(micStream);
            micSource.connect(destination);

            const micRecorder = new MediaRecorder(micStream);
            micRecorderRef.current = micRecorder;
            micChunksRef.current = [];

            micRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) micChunksRef.current.push(e.data);
            };
            micRecorder.start();

            let displayStream: MediaStream | null = null;
            const combinedStream = new MediaStream();

            if (selected === 1) {
                displayStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true,
                });

                const systemAudioTracks = displayStream.getAudioTracks();
                if (systemAudioTracks.length > 0) {
                    const systemSource = audioContext.createMediaStreamSource(displayStream);
                    systemSource.connect(destination);
                }

                if (captureVideo) {
                    displayStream.getVideoTracks().forEach((track) => {
                        combinedStream.addTrack(track);
                    });
                }
            }

            destination.stream.getAudioTracks().forEach((track) => {
                combinedStream.addTrack(track);
            });

            const mediaRecorder = new MediaRecorder(combinedStream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                setDownloadURL(URL.createObjectURL(blob));

                const file = new File([blob], "recording.webm", {
                    type: "video/webm",
                    lastModified: Date.now()
                });

                setFile(file);

                if (displayStream) {
                    displayStream.getTracks().forEach((track) => track.stop());
                }
                micStream.getTracks().forEach((track) => track.stop());
                audioContext.close();
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
            alert("Failed to start recording: " + (error instanceof Error ? error.message : String(error)));
        }
    };


    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        if (micRecorderRef.current) {
            micRecorderRef.current.stop();
        }
        setRecording(false);
    };

    return (
        <div className="flex flex-col items-center gap-4">

            <div className="bg-bg-dark w-full flex flex-row items-center rounded-md p-1 mb-4">
                <ToggleButton id={1} selected={selected === 1} setSelected={setSelected} label="Micrófono y Dispositivo"/>
                <ToggleButton id={2} selected={selected === 2} setSelected={setSelected} label="Solo micrófono" />
            </div>

            {selected === 1 ? (
                <div className="flex flex-col gap-2 px-6">
                    <div>
                        Captura audio del micrófono y del sistema. Ideal para llamadas de Teams, Zoom, Meets, etc.
                    </div>
                    {!downloadURL && (
                        <div className="flex flex-row items-center gap-2 pb-7">
                            <input defaultChecked={captureVideo} type="checkbox" className="focus:bg-primary" onChange={(e) => setCaptureVideo(e.target.checked)} />
                            <label className="text-gray-500 text-sm">
                                Capturar video
                            </label>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-2 px-6">
                    <div>
                        Captura audio solo del micrófono. Ideal para capturar llamadas en persona o por teléfono en altavoz.
                    </div>
                </div>
            )}

            {!downloadURL && (
                <button
                    onClick={recording ? stopRecording : startRecording}
                    className="py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                >
                    {recording ? (
                        <div className="flex flex-row gap-2 items-center">
                            <FaRegStopCircle className="animate-pulse" />
                            <span className="ml-2"> Detener grabación </span>
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 items-center">
                            <PiRecordFill />
                            <span className="ml-2">Empezar grabación</span>
                        </div>
                    )}
                </button>
            )}


            {downloadURL && (
                <div className="flex flex-col items-center gap-4">
                    {captureVideo && selected === 1 ? (
                        <div className="flex flex-col items-center gap-2 px-5">
                            <video
                                src={downloadURL}
                                controls
                                className="mt-2 border border-gray-300 rounded"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <audio
                                src={downloadURL}
                                controls
                                className="mt-2 max-w-lg rounded"
                            />
                        </div>
                    )}
                    <div className="flex flex-row gap-3 pt-4">
                        <button onClick={() => setDownloadURL(null)} className="py-2 px-4 bg-bg-dark text-gray-500 rounded-md hover:bg-bg-extradark transition flex flex-row items-center">
                            <span className=""> Repetir grabación </span>
                        </button>
                        <button onClick={handleAnalize} className="py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition flex flex-row items-center">
                            <IoSparklesSharp />
                            <span className="ml-2"> Analizar llamada </span>
                        </button>
                    </div>
                </div>

            )}

        </div>
    );
};

export default Recording;
