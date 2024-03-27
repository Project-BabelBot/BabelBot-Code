import CloseIcon from "@mui/icons-material/Close";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useRef, useState } from "react";
import ActionButtons from "../components/ActionButtons";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Header from "../components/Header";
import { useAppSelector } from "../state/hooks";
import { Message } from "../state/slices/messagesSlice";
import VirtualKeyboard from "../components/VirtualKeyboard";
import Typography from "@mui/material/Typography";

const styles = {
  // TODO: Fix theming
  actionButton: { padding: 0 },
  actionItems: {
    alignItems: "center",
    display: "flex",
    gap: 1,
    padding: 1,
  },
  botMessage: {
    alignItems: "flex-start",
    display: "flex",
    flex: "0 1 auto",
    flexDirection: "column",
  },
  botMessageText: {
    backgroundColor: "primary.dark",
    border: 2,
    borderColor: "secondary.main",
    borderRadius: 2,
    boxSizing: "border-box",
    color: "primary.contrastText",
    padding: 1,
  },
  chatList: { height: "100%", overflowY: "scroll" },
  dialogIconButton: { padding: 0 },
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noMessagesPrompt: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 5,
  },
  root: { display: "flex", flexDirection: "column", height: "100%" },
  userMessage: {
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "column",
  },
  userMessageText: {
    backgroundColor: "#F3F1EE",
    border: 2,
    borderColor: "secondary.main",
    borderRadius: 2,
    boxSizing: "border-box",
    padding: 1,
  },
};

const ResponsePage = () => {
  const [open, setOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const { keyboardActive } = useAppSelector((state) => state.actionButtons);
  const { messages } = useAppSelector((state) => state.messages);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length <= 0) {
      return;
    }
    const latestMessage = messages[messages.length - 1];
    let timeoutId: NodeJS.Timeout | undefined;
    if (!latestMessage.userIsSender) {
      // If user is not sender, read message via tts
      readMessage(latestMessage);
      if (latestMessage.attachment) {
        timeoutId = setTimeout(() => {
          setOpen(true);
        }, 1000);
      }
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }

    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };

      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
      loadVoices(); // Call loadVoices once to get voices on initial load

      return () => {
        console.log("IN CLEANUP");
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    } else {
      console.error("Speech synthesis is not supported in this browser");
    }
  }, []);

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedMessage(null);
  };

  const readMessage = (message: Message) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = "en-US";
      utterance.rate = 1.5;
      utterance.pitch = 1.0;

      const voices = speechSynthesis.getVoices();
      const englishVoice = voices[2];

      if (englishVoice) {
        utterance.voice = englishVoice;
      } else {
        console.error("Can't find a voice");
      }
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis is not supported in this browser");
    }
  };

  return (
    <Box sx={styles.root}>
      <Header leftContent={<ActionButtons />} />
      {messages.length > 0 ? (
        <List sx={styles.chatList} component="div" ref={chatContainerRef}>
          {messages.map((o) => {
            return (
              <ListItem component="div" key={o.id}>
                <ListItemText
                  primaryTypographyProps={{
                    sx: o.userIsSender
                      ? styles.userMessageText
                      : styles.botMessageText,
                  }}
                  sx={o.userIsSender ? styles.userMessage : styles.botMessage}
                >
                  {o.content}
                </ListItemText>
                {!o.userIsSender && (
                  <Box sx={styles.actionItems}>
                    {o.attachment && (
                      <IconButton
                        onClick={() => {
                          setOpen(true);
                          setSelectedMessage(o);
                        }}
                        sx={styles.actionButton}
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => {
                        readMessage(o);
                      }}
                      sx={styles.actionButton}
                    >
                      <VolumeUpIcon />
                    </IconButton>
                  </Box>
                )}
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Box sx={styles.noMessagesPrompt}>
          <Typography variant="h5">Ask me something!</Typography>
          <Typography variant="subtitle2">
            I'd be happy to assist you with what you need! Start a conversation
            using the microphone or keyboard button!
          </Typography>
        </Box>
      )}
      {selectedMessage && (
        <Dialog open={open} onClose={handleDialogClose}>
          <DialogTitle sx={styles.dialogTitle}>
            <Box>Attachment</Box>
            <IconButton
              onClick={handleDialogClose}
              sx={styles.dialogIconButton}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{selectedMessage.content}</DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {keyboardActive ? <VirtualKeyboard /> : null}
    </Box>
  );
};

export default ResponsePage;
