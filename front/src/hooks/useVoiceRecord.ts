import { useEffect, useState, useRef } from "react";

export const useRecordVoice = () => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recording, setRecording] = useState<boolean>(false);
    const [audioData, setAudioData] = useState<Blob | null>(null);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const chunks = useRef<BlobPart[]>([]);

    const startRecording = (): void => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
            mediaRecorderRef.current.start();
            setRecording(true);
        }
    };

    const stopRecording = (): void => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setAudioStream(stream);
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.onstart = () => {
                    chunks.current = [];
                };
                mediaRecorder.ondataavailable = (event: BlobEvent) => {
                    chunks.current.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
                    setAudioData(audioBlob);
                };
                mediaRecorderRef.current = mediaRecorder;
            } catch (err) {
                console.error("Error accessing media devices:", err);
                setError("Permission denied. Please allow access to the microphone.");
            }
        };

        if (typeof window !== "undefined" && !mediaRecorderRef.current) {
            getMediaStream();
        }

        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    return { recording, startRecording, stopRecording, audioData, audioStream, error };
};