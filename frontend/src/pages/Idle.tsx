import { Box, Button, Typography } from "@mui/material";
import logo from "../assets/logo.png";
import Clock from "../components/Clock";

const styles = {
  header: {
    alignItems: "flex-start",
  },
};

const Idle = () => {
  return (
    <Box>
      <Box sx={styles.header}>
        <img
          src={logo}
          alt="BabelBot logo"
          style={{
            width: 150,
            height: 100,
            position: "fixed",
            top: "10px",
            left: "10px",
          }}
        />

        <Clock />
      </Box>

      <Box>
        <Typography>Insert Avatar</Typography>
      </Box>
      <Button>Touch to Start</Button>
    </Box>
  );
};

export default Idle;
