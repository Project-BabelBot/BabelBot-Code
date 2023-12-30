import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";

const styles = {
  // TODO: Fix theming
  botMessage: {
    backgroundColor: "primary.dark",
    border: 2,
    borderColor: "secondary.main",
    borderRadius: 2,
    boxSizing: "border-box",
    color: "primary.contrastText",
    padding: 1,
  },
  userMessage: {
    alignItems: "flex-end",
    backgroundColor: "#F3F1EE",
    border: 2,
    borderColor: "secondary.main",
    borderRadius: 2,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    padding: 1,
  },
};

type Message = {
  id: number;
  content: string;
  userIsSender: boolean;
  timestamp: string;
};

const ResponsePage = () => {
  const [messages, setmessages] = useState(demoMessages);

  return (
    <>
      <List component="div">
        {messages.map((o) => {
          return (
            <ListItem component="div" key={o.id}>
              <ListItemText
                sx={o.userIsSender ? styles.userMessage : styles.botMessage}
              >
                {o.content}
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
    </>
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
    id: 2,
    content: "Hello user!",
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
