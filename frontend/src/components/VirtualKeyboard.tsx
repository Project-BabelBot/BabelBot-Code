import { Box, Typography } from "@mui/material";
import Keyboard from "react-simple-keyboard";

//For styling the keyboard
const styles = {};

//Function for when the key is pressed
const onKeyPress = () => {};

//Function for changing the layout based on the language detected
const handleLanguage = () => {};

//Function when the shift button is pressed
const handleShift = () => {};

/*Function when the Caps button is pressed.
  Will have to change layout to upper case*/
const handleCaps = () => {};

const VirtualKeyboard = () => {
  return (
    <Box>
      <Typography>Keyboard</Typography>
      <Keyboard />
    </Box>
  );
};

export default VirtualKeyboard;
