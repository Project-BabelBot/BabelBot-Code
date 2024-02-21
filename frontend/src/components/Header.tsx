import Box from "@mui/material/Box";
import { ReactNode } from "react";
import Clock from "./Clock";

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    flex: "0 0 auto",
    padding: 1
  },
};

type HeaderProps = {
  leftContent?: ReactNode;
};

const Header = ({ leftContent }: HeaderProps) => {
  return (
    <Box sx={styles.header}>
      {leftContent}
      <Clock />
    </Box>
  );
};

export default Header;
