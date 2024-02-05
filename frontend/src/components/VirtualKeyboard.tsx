import { Box } from "@mui/system";
import { FunctionComponent, MutableRefObject, useState } from "react";
import Keyboard from "react-simple-keyboard";

// type IProps = {
//   onChange: (input: string) => void;
//   keyboardRef: MutableRefObject<typeof Keyboard>;
// };

interface IProps {
  onChange: (input: string) => void;
  keyboardRef: MutableRefObject<typeof Keyboard>;
}

const VirtualKeyboard: FunctionComponent<IProps> = ({
  onChange,
  keyboardRef,
}) => {
  const [layoutName, setLayoutName] = useState("default"); // Initialize state for layout

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }
  };

  return (
    <Box>
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layoutName}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
    </Box>
  );
};

export default VirtualKeyboard;
