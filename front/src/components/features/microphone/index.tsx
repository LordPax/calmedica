'use client';
import React, { useState, useEffect } from 'react';
import { useRecordVoice } from '@/hooks/useVoiceRecord';
import Image from 'next/image';

interface MicrophoneProps {
    onAudioData: (text: string) => void;
}

const Microphone: React.FC<MicrophoneProps> = ({ onAudioData }) => {
    const { startRecording, stopRecording, audioStream, audioData } = useRecordVoice();
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [rippleSize, setRippleSize] = useState<number>(20);

    const toggleRecording = (): void => {
        if (isRecording) {
            stopRecording();
            setIsRecording(false);
        } else {
            startRecording();
            setIsRecording(true);
        }
    };

    const submitData = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);

        const response = await fetch('/api/microphone', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        onAudioData(data.response.text);
    }

    useEffect(() => {
        if (!audioStream) return;

        const audioContext = new AudioContext();
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 2048;
        analyzer.minDecibels = -90;
        analyzer.maxDecibels = -10;

        const microphone = audioContext.createMediaStreamSource(audioStream);
        microphone.connect(analyzer);

        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        const updateVolume = (): void => {
            analyzer.getByteFrequencyData(dataArray);
            const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
            const newRippleSize = Math.min(20 + volume * 1.5, 150);
            setRippleSize(newRippleSize);
            requestAnimationFrame(updateVolume);
        };
        updateVolume();

        return () => {
            audioContext.close().then(() => {});
        };
    }, [audioStream]);

    useEffect(() => {
        if (audioData) {
            submitData(audioData);
        }
    }, [audioData]);

    return (
        <button
            type="button"
            onClick={toggleRecording}
            className="relative w-10 h-10 flex justify-center items-center bg-transparent border-none sm:hidden md:flex lg:flex xl:flex"
        >
            <Image src="/images/microphone.svg" alt="microphone" width={23} height={23} />
            {isRecording && (
                <div
                    className="ripple-effect"
                    style={{ width: rippleSize, height: rippleSize }}
                ></div>
            )}
        </button>
    );
}

export default Microphone;