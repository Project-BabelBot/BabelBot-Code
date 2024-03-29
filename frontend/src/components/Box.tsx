import { Box as MuiBox, BoxProps, Theme } from "@mui/material";
import { SystemProps } from "@mui/system";

export interface BoxWrapperProps extends SystemProps<Theme> {
  alt?: string;
  children?: React.ReactNode;
  id?: string;
  src?: string;
  sx?: BoxProps["sx"];
}

export const Box = ({ alt, src, ...rest }: BoxWrapperProps) => {
  return <MuiBox component="div" {...rest} />;
};

export const Img = (props: BoxWrapperProps) => {
  return <MuiBox component="img" {...props} />;
};
