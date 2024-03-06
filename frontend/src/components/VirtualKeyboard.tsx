import { Box } from "@mui/system";
import { FunctionComponent, MutableRefObject, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";

// type IProps = {
//   onChange: (input: string) => void;
//   keyboardRef: MutableRefObject<typeof Keyboard>;
// };

interface IProps {
  onChange: (input: string) => void;
}

const VirtualKeyboard: FunctionComponent<IProps> = ({
  onChange,
}) => {
  const [layoutName, setLayoutName] = useState("default"); // Initialize state for layout
  const keyboard = useRef<any>(null);

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }
  };

  return (
    <Box>
      {/* <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layoutName}
        onChange={onChange}
        onKeyPress={onKeyPress}
        theme={"hg-theme-default hg-layout-default myTheme"}
        layout={{
          default: [
            "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
            "{tab} q w e r t y u i o p [ ] \\",
            "{lock} a s d f g h j k l ; ' {enter}",
            "{shift} z x c v b n m , . / {shift}",
            ".com @ {space}"
          ],
          shift: [
            "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
            "{tab} Q W E R T Y U I O P { } |",
            '{lock} A S D F G H J K L : " {enter}',
            "{shift} Z X C V B N M < > ? {shift}",
            ".com @ {space}"
          ]
        }}
        buttonTheme={[
          {
            class: "hg-red",
            buttons: "Q W E R T Y q w e r t y"
          },
          {
            class: "hg-highlight",
            buttons: "Q q"
          }
        ]}
      /> */}
      <Keyboard
          keyboardRef={(r)=>(keyboard.current= r)}
          onChange={input => onChange(input)}
          onKeyPress={button => onKeyPress(button)}
          theme={"hg-theme-default hg-layout-default myTheme"}
          layoutName={"default"}
        />
    </Box>
  );
};

export default VirtualKeyboard;
