import KeyboardIcon from "@mui/icons-material/Keyboard";
import MicIcon from "@mui/icons-material/Mic";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import {
  setKeyboardActive,
  setMicActive,
} from "../state/slices/actionButtonSlice";
import { useAppSelector } from "../state/hooks";

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
  const dispatch = useDispatch();

  const { micActive, keyboardActive } = useAppSelector(
    (state) => state.actionButtons
  );

  const onMicClick = () => {
    if (micActive) {
      // Process audio
      dispatch(setMicActive(false));
    } else {
      dispatch(setMicActive(true));
      dispatch(setKeyboardActive(false));
      // Record audio
    }
  };

  const onKeyboardClick = () => {
    if (keyboardActive) {
      // Close keyboard
      dispatch(setKeyboardActive(false));
    } else {
      dispatch(setMicActive(false));
      dispatch(setKeyboardActive(true));
      // Display keyboard
    }
  };

  // const [input, setInput] = useState("");
  // const keyboard = useRef<any>(null);

  // const onChangeInput = (event: ChangeEvent<HTMLInputElement>): void => {
  //   const input = event.target.value;
  //   setInput(input);
  //   keyboard.current!.setInput(input);
  // };

  return (
    // TODO: Fix Theming
    <Box sx={styles.root}>
      <IconButton
        onClick={onMicClick}
        sx={micActive ? styles.activeButton : styles.inactiveButton}
      >
        <MicIcon fontSize="large" />
      </IconButton>
      <IconButton
        onClick={onKeyboardClick}
        sx={keyboardActive ? styles.activeButton : styles.inactiveButton}
      >
        <KeyboardIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default ActionButtons;
