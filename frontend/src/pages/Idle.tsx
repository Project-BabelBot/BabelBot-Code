import { Box, Button, Typography } from "@mui/material";
import logo from "../assets/logo.png";
import Clock from "../components/Clock";

const styles = {
  avatar: {
    aspectRatio: "1/1",
    objectFit: "cover",
  },
  avatarContainer: {
    display: "flex",
    flex: "1 1 auto",
    justifyContent: "center",
    overflow: "hidden",
    paddingY: 7,
  },
  button: { height: "100%" },
  buttonContainer: {
    flex: "0 0 200px",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    flex: "0 0 auto",
    paddingTop: 1,
    paddingX: 1,
  },
};

const Idle = () => {
  return (
    <Box sx={styles.root}>
      <Box sx={styles.header}>
        <Box
          component="img"
          alt="BabelBot Logo"
          src={logo}
          sx={{
            width: 150,
            height: 100,
          }}
        />
        <Clock />
      </Box>
      <Box sx={styles.avatarContainer}>
        <Box
          component="img"
          alt="BabelBot Logo"
          src={logo}
          sx={styles.avatar}
        />
      </Box>
      <Box sx={styles.buttonContainer}>
        <Button fullWidth variant="contained" sx={styles.button}>
          <Typography variant="h3">Touch to Start</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default Idle;
