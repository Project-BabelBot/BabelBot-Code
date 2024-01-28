import { Box, Button, Typography } from "@mui/material";
import logo from "../assets/logo.png";
import Header from "../components/Header";

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
  header: {
    display: "flex",
    justifyContent: "space-between",
    flex: "0 0 auto",
    paddingTop: 1,
    paddingX: 1,
  },
  logo: {
    aspectRatio: "1/1",
    width: 100,
    height: 100,
    objectFit: "cover",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
};

const Idle = () => {
  return (
    <Box sx={styles.root}>
      <Header
        leftContent={
          <Box
            component="img"
            alt="BabelBot Logo"
            src={logo}
            sx={styles.logo}
          />
        }
      />
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
