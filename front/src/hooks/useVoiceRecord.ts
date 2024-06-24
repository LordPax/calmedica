import { useEffect, useState, useRef } from "react";

export const useRecordVoice = () => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recording, setRecording] = useState<boolean>(false);
    const [audioData, setAudioData] = useState<Blob | null>(null);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
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
        if (typeof window !== "undefined" && !mediaRecorderRef.current) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream: MediaStream) => {
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
                })
                .catch((error: Error) => {
                    console.error("Error accessing media devices:", error);
                });
        }

        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    return { recording, startRecording, stopRecording, audioData, audioStream };
};
