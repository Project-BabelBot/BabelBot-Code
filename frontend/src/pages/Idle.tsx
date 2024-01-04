import { Box, Button, Typography } from "@mui/material";
import logo from "../assets/logo.png";

const styles = {
  header: {
    alignItems: "flex-start",
  },
  box: {
    height: "100%",
  },
};

const Idle = () => {
  return (
    <Box>
      {/* <Box>
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
      </Box> */}
      <Box>
        <Typography>Insert Avatar</Typography>
      </Box>
      <Button fullWidth variant="contained">
        Touch to Start
      </Button>
    </Box>
  );
};

export default Idle;
