import { createTheme } from "@mantine/core";
import variables from "../../../variables.module.scss";
import {hslToHex} from "@features/(shared)/_components/providers/Mantine/colors.js";

const theme: any = createTheme({
  fontFamily: "Roboto, sans-serif",
  primaryColor: "accented",
  primaryShade: 5,
  scale: 1,
  white: hslToHex(variables.lightBase0),
  black: hslToHex(variables.darkBase0),
  colors: {
    accented: [
      hslToHex(variables.lightAccent0),
      hslToHex(variables.lightAccent10),
      hslToHex(variables.lightAccent20),
      hslToHex(variables.lightAccent30),
      hslToHex(variables.lightAccent40),
      hslToHex(variables.lightAccent50),
      hslToHex(variables.lightAccent60),
      hslToHex(variables.lightAccent70),
      hslToHex(variables.lightAccent80),
      hslToHex(variables.lightAccent90),
    ],
    light: [
      hslToHex(variables.lightBase0),
      hslToHex(variables.lightBase10),
      hslToHex(variables.lightBase20),
      hslToHex(variables.lightBase30),
      hslToHex(variables.lightBase40),
      hslToHex(variables.lightBase50),
      hslToHex(variables.lightBase60),
      hslToHex(variables.lightBase70),
      hslToHex(variables.lightBase80),
      hslToHex(variables.lightBase90),
    ],
    dark: [
      hslToHex(variables.darkBase100),
      hslToHex(variables.darkBase90),
      hslToHex(variables.darkBase80),
      hslToHex(variables.darkBase70),
      hslToHex(variables.darkBase60),
      hslToHex(variables.darkBase50),
      hslToHex(variables.darkBase40),
      hslToHex(variables.darkBase30),
      hslToHex(variables.darkBase20),
      hslToHex(variables.darkBase10),
    ],
  },
  fontSizes: {
    xs: variables.a0,
    sm: variables.b1,
    md: variables.a1,
    lg: variables.b2,
    xl: variables.a2,
  },
});

export default theme;
