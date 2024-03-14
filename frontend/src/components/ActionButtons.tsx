import { MediaRecorder } from "extendable-media-recorder";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import KeyboardHideIcon from "@mui/icons-material/KeyboardHide";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useEffect, useRef, useDispatch } from "react-redux";
import {
  setKeyboardActive,
  setMicActive,
} from "../state/slices/actionButtonSlice";
import { useAppSelector } from "../state/hooks";
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

const ActionButtons = () => {
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const dispatch = useDispatch();

  const { micActive, keyboardActive } = useAppSelector(
    (state) => state.actionButtons
  );

  const navigate = useNavigate();

  const startRecording = async (): Promise<void> => {
    audioChunksRef.current = [];
    audioStreamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    mediaRecorderRef.current = new MediaRecorder(audioStreamRef.current, {
      mimeType: "audio/wav",
    }) as MediaRecorder;
    mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
      audioChunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.start();
  };

  const stopRecording = async (): Promise<void> => {
    const formData = new FormData();

    if (audioStreamRef.current) {
      audioStreamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
      audioStreamRef.current = null;
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioFile = new File([audioBlob], "recording.wav", {
          type: "audio/wav",
        });
        formData.append("file", audioFile, "recording.wav");

        try {
          // Send request and await response
          const res = await axios.post("http://localhost:8000/api/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
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

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (audioStreamRef.current) {
        audioStreamRef.current
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
        audioStreamRef.current = null;
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
    };
  }, []);

  const onMicClick = () => {
    if (micActive) {
      // Process audio
      stopRecording();
      dispatch(setMicActive(false));
    } else {
      startRecording();
      dispatch(setMicActive(true));
      dispatch(setKeyboardActive(false));
    }
  };

  const onKeyboardClick = () => {
    if (keyboardActive) {
      // Close keyboard
      dispatch(setKeyboardActive(false));
    } else {
      // Display keyboard
      dispatch(setMicActive(false));
      dispatch(setKeyboardActive(true));
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
