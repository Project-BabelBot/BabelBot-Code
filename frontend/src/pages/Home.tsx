import Header from "../components/Header";
import ActionButtons from "../components/ActionButtons";
import VirtualKeyboard from "../components/VirtualKeyboard";
import { useAppSelector } from "../state/hooks";
import Avatar from "../components/Avatar";
import { Box } from "../components/Box";

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
  const { keyboardActive } = useAppSelector((state) => state.actionButtons);

  return (
    <Box sx={styles.root}>
      <Header leftContent={<ActionButtons />} />
      <Box sx={styles.avatarContainer}>
        <Avatar height="700px" width="700px" />
      </Box>
      {keyboardActive ? <VirtualKeyboard /> : null}
    </Box>
  );
};

export default Home;
