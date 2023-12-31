import KeyboardIcon from "@mui/icons-material/Keyboard";
import MicIcon from "@mui/icons-material/Mic";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

const styles = {
  button: {
    backgroundColor: "primary.light",
  },
  container: { display: "flex", gap: 1 },
};

const ActionButtons = () => {
  return (
    // TODO: Fix Theming
    <Box sx={styles.container}>
      <IconButton sx={styles.button}>
        <MicIcon fontSize="large" />
      </IconButton>
      <IconButton sx={styles.button}>
        <KeyboardIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default ActionButtons;
