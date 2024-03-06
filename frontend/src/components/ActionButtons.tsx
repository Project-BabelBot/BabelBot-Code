import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import KeyboardHideIcon from "@mui/icons-material/KeyboardHide";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Message } from "../pages/ResponsePage";
import { useNavigate } from "react-router-dom";

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
  setMessages?: (newMessage: Message) => void;
};

const ActionButtons = ({ setMessages }: ActionButtonProps) => {
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [micActive, setMicActive] = useState(false);
  const [keyboardActive, setKeyboardActive] = useState(false);

  const navigate = useNavigate();

  const startRecording = async (): Promise<void> => {
    // try {
    //   audioChunksRef.current = [];
    //   await register(await connect());
    //   audioStreamRef.current = await navigator.mediaDevices.getUserMedia({
    //     audio: true,
    //   });

    //   if (!mediaRecorderRef.current) {
    //     mediaRecorderRef.current = new MediaRecorder(audioStreamRef.current, {
    //       mimeType: "audio/wav",
    //     }) as MediaRecorder;
    //     mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
    //       audioChunksRef.current.push(e.data);
    //     };
    //   }

    //   mediaRecorderRef.current.start();
    //   console.log("START RECORDING:", audioChunksRef.current);
    // } catch (error) {
    //   console.error("Error accessing microphone:", error);
    // }

    audioChunksRef.current = [];

    await register(await connect());
    audioStreamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mimeTypes = ["audio/wav"].filter((type) =>
      MediaRecorder.isTypeSupported(type)
    );

    if (mimeTypes.length === 0) {
      return alert("Browser not supported");
    }

    if (!mediaRecorderRef.current) {
      mediaRecorderRef.current = new MediaRecorder(audioStreamRef.current, {
        mimeType: "audio/wav",
      }) as MediaRecorder;
      mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
        audioChunksRef.current.push(e.data);
      };
    }

    mediaRecorderRef.current.start();
    console.log("START RECORDING:", audioChunksRef.current);
  };

  const stopRecording = async (): Promise<void> => {
    if (audioStreamRef.current) {
      audioStreamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
    }
    console.log(mediaRecorderRef.current);
    if (mediaRecorderRef.current) {
      console.log("Stopping media recorder");
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    console.log("STOP RECORDING", audioChunksRef.current);
    const audioBlob = new Blob(audioChunksRef.current, {
      type: "audio/wav",
    });
    console.log("audioBlob", audioBlob);
    const audioFile = new File([audioBlob], "recording.wav", {
      type: "audio/wav",
    });
    console.log("audioFile", audioFile);
    const formData = new FormData();
    formData.append("file", audioFile, "recording.wav");
    for (const value of formData.values()) {
      console.log(value);
    }
    try {
      // Send request and await response
      const res = await axios.post("http://localhost:8000/api/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Check if response is valid, if so set messages and navigate to response page, if not display an error (how?)
      console.log(res.data);
      if (setMessages) {
        setMessages(res.data);
      } else {
        navigate("/response");
      }
    } catch (error) {
      console.log("API ERROR");
    }
  };

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (audioStreamRef.current) {
        audioStreamRef.current
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

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
        {micActive ? (
          <MicIcon fontSize="large" />
        ) : (
          <MicOffIcon fontSize="large" />
        )}
      </IconButton>
      <IconButton
        onClick={onKeyboardClick}
        sx={keyboardActive ? styles.activeButton : styles.inactiveButton}
      >
        {keyboardActive ? (
          <KeyboardHideIcon fontSize="large" />
        ) : (
          <KeyboardIcon fontSize="large" />
        )}
      </IconButton>
      <audio
        controls
        src={
          audioChunksRef.current.length > 0
            ? URL.createObjectURL(new Blob(audioChunksRef.current))
            : undefined
        }
      />
    </Box>
  );
};

export default ActionButtons;
