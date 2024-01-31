import { Box, Typography } from "@mui/material";
import Keyboard from "react-simple-keyboard";

const VirtualKeyboard = () => {
  return (
    <Box>
      <Typography>Keyboard</Typography>
      <Keyboard />
    </Box>
  );
};

export default VirtualKeyboard;
