import { createTheme } from "@mantine/core";
import variables from "../../../styles/variables.module.scss";
import colors from "../../utils/colors.js";

const theme = createTheme({
  fontFamily: "Roboto, sans-serif",
  // primaryColor: 'accented',
  scale: 1,
  white: colors.hslToHex(variables.lightBase0),
  black: colors.hslToHex(variables.darkBase0),
  colors: {
    accented: [
      colors.hslToHex(variables.lightAccent0),
      colors.hslToHex(variables.lightAccent10),
      colors.hslToHex(variables.lightAccent20),
      colors.hslToHex(variables.lightAccent30),
      colors.hslToHex(variables.lightAccent40),
      colors.hslToHex(variables.lightAccent50),
      colors.hslToHex(variables.lightAccent60),
      colors.hslToHex(variables.lightAccent70),
      colors.hslToHex(variables.lightAccent80),
      colors.hslToHex(variables.lightAccent90),
    ],
    light: [
      colors.hslToHex(variables.lightBase0),
      colors.hslToHex(variables.lightBase10),
      colors.hslToHex(variables.lightBase20),
      colors.hslToHex(variables.lightBase30),
      colors.hslToHex(variables.lightBase40),
      colors.hslToHex(variables.lightBase50),
      colors.hslToHex(variables.lightBase60),
      colors.hslToHex(variables.lightBase70),
      colors.hslToHex(variables.lightBase80),
      colors.hslToHex(variables.lightBase90),
    ],
    dark: [
      colors.hslToHex(variables.darkBase90),
      colors.hslToHex(variables.darkBase80),
      colors.hslToHex(variables.darkBase70),
      colors.hslToHex(variables.darkBase60),
      colors.hslToHex(variables.darkBase50),
      colors.hslToHex(variables.darkBase40),
      colors.hslToHex(variables.darkBase30),
      colors.hslToHex(variables.darkBase20),
      colors.hslToHex(variables.darkBase10),
      colors.hslToHex(variables.darkBase0),
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
