import CloseIcon from "@mui/icons-material/Close";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import ActionButtons from "../components/ActionButtons";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Header from "../components/Header";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { Message, setMessages } from "../state/slices/messagesSlice";
import VirtualKeyboard from "../components/VirtualKeyboard";

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
  chatList: { overflowY: "scroll" },
  dialogIconButton: { padding: 0 },
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  const { keyboardActive } = useAppSelector((state) => state.actionButtons);
  const { messages } = useAppSelector((state) => state.messages);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setMessages(demoMessages));
  }, [dispatch]);

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

    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedMessage(null);
  };

  const readMessage = (message: Message) => {
    // Use tts to read message
  };

  return (
    <Box sx={styles.root}>
      <Header leftContent={<ActionButtons />} />
      <List sx={styles.chatList} component="div">
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
                  <IconButton sx={styles.actionButton}>
                    <VolumeUpIcon />
                  </IconButton>
                </Box>
              )}
            </ListItem>
          );
        })}
      </List>
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

const demoMessages: Message[] = [
  {
    id: 1,
    content:
      "How's it going?",
    userIsSender: true,
    timestamp: new Date(2023, 12, 29, 12, 0, 0).toISOString(),
  },
  {
    id: 2,
    content:
      "Greetings! Welcome to the border security checkpoint. How can I assist you today?",
    userIsSender: false,
    timestamp: new Date(2023, 12, 29, 12, 1, 0).toISOString(),
  },
  {
    id: 3,
    content:
      "Can you explain the security guidelines?",
    userIsSender: true,
    timestamp: new Date(2023, 12, 29, 12, 0, 0).toISOString(),
  },
  {
    attachment: "Map to Security",
    id: 4,
    content:
      "To ensure a secure environment, we have specific protocols in place. Please comply with our officers and guidelines.",
    userIsSender: false,
    timestamp: new Date(2023, 12, 29, 12, 1, 0).toISOString(),
  }
];

export default ResponsePage;
