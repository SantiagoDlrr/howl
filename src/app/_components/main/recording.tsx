"use client";

import { useState, useRef } from "react";
import Button from "../button";
import { PiRecordFill } from "react-icons/pi";
import { FaRegStopCircle } from "react-icons/fa";
import ToggleButton from "../toggleButton";


const Recording = () => {
    const [recording, setRecording] = useState(false);
    const [downloadURL, setDownloadURL] = useState<string | null>(null);
    const [selected, setSelected] = useState<number>(1);
    const [captureVideo, setCaptureVideo] = useState(false);
    // const [micOnlyURL, setMicOnlyURL] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const micChunksRef = useRef<Blob[]>([]);
    const micRecorderRef = useRef<MediaRecorder | null>(null);

    const startRecording = async () => {
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });

            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            // Start separate mic-only recorder
            const micRecorder = new MediaRecorder(micStream);
            micRecorderRef.current = micRecorder;
            micChunksRef.current = [];

            micRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) micChunksRef.current.push(e.data);
            };
            micRecorder.start();

            const audioContext = new AudioContext();
            const destination = audioContext.createMediaStreamDestination();

            const systemSource = audioContext.createMediaStreamSource(displayStream);
            const micSource = audioContext.createMediaStreamSource(micStream);

            systemSource.connect(destination);
            micSource.connect(destination);

            const combinedStream = new MediaStream();

            if (captureVideo) {
                displayStream.getVideoTracks().forEach((track) =>
                    combinedStream.addTrack(track)
                );
            }


            destination.stream.getAudioTracks().forEach((track) =>
                combinedStream.addTrack(track)
            );

            const mediaRecorder = new MediaRecorder(combinedStream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                setDownloadURL(URL.createObjectURL(blob));

                // Stop screen + mic
                displayStream.getTracks().forEach((track) => track.stop());
                micStream.getTracks().forEach((track) => track.stop());
                audioContext.close();
            };

            // micRecorder.onstop = () => {
            //     const micBlob = new Blob(micChunksRef.current, { type: "audio/webm" });
            //     setMicOnlyURL(URL.createObjectURL(micBlob));
            // };

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
                <ToggleButton id={1} selected={selected === 1} setSelected={setSelected} />
                <ToggleButton id={2} selected={selected === 2} setSelected={setSelected} />
            </div>

            {selected === 1 ? (
                <div className="flex flex-col gap-2 px-6">
                    <div>
                        Captura audio del micrófono y del sistema. Ideal para llamadas de Teams, Zoom, Meets, etc.
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <input defaultChecked={captureVideo} type="checkbox" className="focus:bg-primary" onChange={(e) => setCaptureVideo(e.target.checked)} />
                        <label className="text-gray-500 text-sm">
                            Capturar video
                        </label>
                    </div>
                </div>
            ) : (
                <div className="flex flex-row items-center gap-2">
                    <input type="checkbox" className="focus:bg-primary" />
                    <label className="text-gray-500 text-sm">
                        Capturar pantalla y audio
                    </label>
                </div>
            )}


            <button
                onClick={recording ? stopRecording : startRecording}
                className="py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
            >
                {recording ? (
                    <div>
                        <FaRegStopCircle />
                    </div>
                ) : (
                    <div className="flex flex-row gap-2 items-center">
                        <PiRecordFill />
                        <span className="ml-2">Empezar grabación</span>
                    </div>
                )}
            </button>


            {recording && <p className="text-red-500">🔴 Recording in progress...</p>}

            {downloadURL && selected === 1 && (
                captureVideo ? (
                    <div className="flex flex-col items-center gap-2">
                        <video
                            src={downloadURL}
                            controls
                            className="mt-2 max-w-lg border border-gray-300 rounded"
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
                )

            )}

        </div>
    );
};

export default Recording;
