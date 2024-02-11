import KeyboardIcon from "@mui/icons-material/Keyboard";
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide';
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from '@mui/icons-material/MicOff';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { Message } from "../pages/ResponsePage";
import AudioRecorder from "./AudioRecorder";

const styles = {
  activeButton: {
    backgroundColor: "secondary.main",
  },
  inactiveButton: {
    backgroundColor: "primary.light",
  },
  root: { display: "flex", gap: 1 },
};

type ActionButtonProps = {
  setMessages: () => void;
}

const ActionButtons = ({}) => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  const [micActive, setMicActive] = useState(false);
  const [keyboardActive, setKeyboardActive] = useState(false);

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
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = (): void => {
    if (audioStream) {
      audioStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
  };

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (audioStream) {
        audioStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, [audioStream]);

  const onMicClick = () => {
    if (micActive) {
      // Process audio
      stopRecording();
      setMicActive(false);
    } else {
      setMicActive(true);
      setKeyboardActive(false);
      startRecording();
    }
  };

  const onKeyboardClick = () => {
    if (keyboardActive) {
      // Close keyboard
      setKeyboardActive(false);
    } else {
      setMicActive(false);
      setKeyboardActive(true);
      // Display keyboard
    }
  };

  return (
    // TODO: Fix Theming
    <Box sx={styles.root}>
      <IconButton
        onClick={onMicClick}
        sx={micActive ? styles.activeButton : styles.inactiveButton}
      >
        {micActive ? <MicIcon fontSize="large" /> : <MicOffIcon fontSize="large"/>}
      </IconButton>
      <IconButton
        onClick={onKeyboardClick}
        sx={keyboardActive ? styles.activeButton : styles.inactiveButton}
      >
        {keyboardActive ? <KeyboardHideIcon fontSize="large"/>: <KeyboardIcon fontSize="large" />}
      </IconButton>
      <audio controls src={audioChunks.length > 0 ? URL.createObjectURL(new Blob(audioChunks)) : undefined} />
    </Box>
  );
};

export default ActionButtons;
