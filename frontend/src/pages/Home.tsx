import Box from "@mui/material/Box";
import logo from "../assets/logo.png";
import Header from "../components/Header";
import ActionButtons from "../components/ActionButtons";
import Avatar from "../components/Avatar";
import { useNavigate } from "react-router-dom";

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
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
};

const Home = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/response");
  };

  return (
    <Box sx={styles.root}>
      <Header leftContent={<ActionButtons handleEnter={handleEnter}/>} />
      <Box sx={styles.avatarContainer}>
        {/* <Box
          component="img"
          alt="BabelBot Logo"
          src={logo}
          sx={styles.avatar}
        /> */}
        <Avatar />
      </Box>
    </Box>
  );
};

export default Home;
