import { useState, useEffect } from 'react';

function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async (): Promise<void> => {
    try {
      setAudioChunks([]);
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const mediaRecorder: MediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        setAudioChunks((chunks: Blob[]) => [...chunks, e.data]);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = (): void => {
    if (audioStream) {
      audioStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    setRecording(false);
  };

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (audioStream) {
        audioStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, [audioStream]);

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <audio controls src={audioChunks.length > 0 ? URL.createObjectURL(new Blob(audioChunks)) : undefined} />
    </div>
  );
}

export default AudioRecorder;
