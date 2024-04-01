import { MediaRecorder } from "extendable-media-recorder";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import KeyboardHideIcon from "@mui/icons-material/KeyboardHide";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import IconButton from "@mui/material/IconButton";
import {
  setKeyboardActive,
  setMicActive,
} from "../state/slices/actionButtonSlice";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import axios, { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { appendMessage } from "../state/slices/messagesSlice";
import { Box } from "./Box";
import { openSnackbar } from "../state/slices/snackbarSlice";

const styles = {
  activeButton: {
    backgroundColor: "secondary.main",
    height: "75px",
    width: "75px",
  },
  inactiveButton: {
    backgroundColor: "primary.light",
    height: "75px",
    width: "75px",
  },
  root: { alignItems: "center", display: "flex", gap: 1 },
};

const ActionButtons = () => {
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const dispatch = useAppDispatch();

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

  const stopRecording = async (abortSend = false): Promise<void> => {
    const formData = new FormData();

    if (audioStreamRef.current) {
      audioStreamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
      audioStreamRef.current = null;
    }

    if (mediaRecorderRef.current && !abortSend) {
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
          const { userQuery } = res.data;
          const { botResponse } = res.data;
          dispatch(appendMessage(userQuery));
          dispatch(appendMessage(botResponse));
          navigate("/response");
        } catch (error) {
          if (isAxiosError(error)) {
            if (error.response) {
              dispatch(appendMessage(error.response.data));
            } else {
              dispatch(openSnackbar());
            }
          }
          navigate("/response");
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
      dispatch(setMicActive(true));
      dispatch(setKeyboardActive(false));
      startRecording();
    }
  };

  const onKeyboardClick = () => {
    if (keyboardActive) {
      // Close keyboard
      dispatch(setKeyboardActive(false));
    } else {
      // Display keyboard
      stopRecording(true);
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
    </Box>
  );
};

export default ActionButtons;
