import CloseIcon from "@mui/icons-material/Close";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import ActionButtons from "../components/ActionButtons";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Header from "../components/Header";
import { useAppSelector } from "../state/hooks";
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

export type Message = {
  attachment?: string;
  content: string;
  id: number;
  timestamp: string;
  userIsSender: boolean;
};

const ResponsePage = () => {
  const [messages, setMessages] = useState(demoMessages);
  const [open, setOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { keyboardState } = useAppSelector((state) => state.actionbutton);

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedMessage(null);
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
      <Box>{keyboardState ? <VirtualKeyboard /> : null}</Box>
    </Box>
  );
};

const demoMessages: Message[] = [
  {
    id: 1,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisi quis eleifend quam adipiscing. Ipsum a arcu cursus vitae congue mauris. Nunc sed id semper risus in hendrerit gravida. Cursus euismod quis viverra nibh cras pulvinar mattis. Gravida quis blandit turpis cursus in. Porttitor lacus luctus accumsan tortor posuere ac ut consequat semper. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Aliquam ut porttitor leo a. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Pulvinar pellentesque habitant morbi tristique senectus et netus et malesuada.!",
    userIsSender: true,
    timestamp: new Date(2023, 12, 29, 12, 0, 0).toISOString(),
  },
  {
    attachment: "Hello",
    id: 2,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisi quis eleifend quam adipiscing. Ipsum a arcu cursus vitae congue mauris. Nunc sed id semper risus in hendrerit gravida. Cursus euismod quis viverra nibh cras pulvinar mattis. Gravida quis blandit turpis cursus in. Porttitor lacus luctus accumsan tortor posuere ac ut consequat semper. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Aliquam ut porttitor leo a. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Pulvinar pellentesque habitant morbi tristique senectus et netus et malesuada.!",
    userIsSender: false,
    timestamp: new Date(2023, 12, 29, 12, 1, 0).toISOString(),
  },
  {
    id: 3,
    content: "Hello BabelBot!",
    userIsSender: true,
    timestamp: new Date(2023, 12, 29, 12, 0, 0).toISOString(),
  },
  {
    attachment: "Hello",
    id: 4,
    content: "Hello user!",
    userIsSender: false,
    timestamp: new Date(2023, 12, 29, 12, 1, 0).toISOString(),
  },
  {
    id: 5,
    content: "Hello BabelBot!",
    userIsSender: true,
    timestamp: new Date(2023, 12, 29, 12, 0, 0).toISOString(),
  },
  {
    id: 6,
    content: "Hello user!",
    userIsSender: false,
    timestamp: new Date(2023, 12, 29, 12, 1, 0).toISOString(),
  },
  {
    id: 7,
    content: "Hello BabelBot!",
    userIsSender: true,
    timestamp: new Date(2023, 12, 29, 12, 0, 0).toISOString(),
  },
  {
    id: 8,
    content: "Hello user!",
    userIsSender: false,
    timestamp: new Date(2023, 12, 29, 12, 1, 0).toISOString(),
  },
  {
    id: 9,
    content: "Hello BabelBot!",
    userIsSender: true,
    timestamp: new Date(2023, 12, 29, 12, 0, 0).toISOString(),
  },
  {
    id: 10,
    content: "Hello user!",
    userIsSender: false,
    timestamp: new Date(2023, 12, 29, 12, 1, 0).toISOString(),
  },
  {
    id: 11,
    content: "Hello BabelBot!",
    userIsSender: true,
    timestamp: new Date(2023, 12, 29, 12, 0, 0).toISOString(),
  },
  {
    id: 12,
    content: "Hello user!",
    userIsSender: false,
    timestamp: new Date(2023, 12, 29, 12, 1, 0).toISOString(),
  },
  {
    id: 13,
    content: "Hello BabelBot!",
    userIsSender: true,
    timestamp: new Date(2023, 12, 29, 12, 0, 0).toISOString(),
  },
  {
    id: 14,
    content: "Hello user!",
    userIsSender: false,
    timestamp: new Date(2023, 12, 29, 12, 1, 0).toISOString(),
  },
  {
    id: 15,
    content: "Hello BabelBot!",
    userIsSender: true,
    timestamp: new Date(2023, 12, 29, 12, 0, 0).toISOString(),
  },
  {
    id: 16,
    content: "Hello user!",
    userIsSender: false,
    timestamp: new Date(2023, 12, 29, 12, 1, 0).toISOString(),
  },
  {
    id: 17,
    content: "Hello BabelBot!",
    userIsSender: true,
    timestamp: new Date(2023, 12, 29, 12, 0, 0).toISOString(),
  },
  {
    id: 18,
    content: "Hello user!",
    userIsSender: false,
    timestamp: new Date(2023, 12, 29, 12, 1, 0).toISOString(),
  },
];

export default ResponsePage;
