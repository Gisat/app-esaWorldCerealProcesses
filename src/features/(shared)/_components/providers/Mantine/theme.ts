import { createTheme } from "@mantine/core";

const theme: any = createTheme({
  fontFamily: "Roboto, sans-serif",
  primaryColor: "accented",
  primaryShade: 5,
  scale: 1,
  white: 'var(--base0)',
  black: 'var(--base950)',
  colors: {
    accented: [
      'var(--accent25)',
      'var(--accent100)',
      'var(--accent200)',
      'var(--accent300)',
      'var(--accent400)',
      'var(--accent500)',
      'var(--accent600)',
      'var(--accent700)',
      'var(--accent800)',
      'var(--accent900)',
    ],
    light: [
      'var(--base0)',
      'var(--base100)',
      'var(--base200)',
      'var(--base300)',
      'var(--base400)',
      'var(--base500)',
      'var(--base600)',
      'var(--base700)',
      'var(--base800)',
      'var(--base900)',
    ],
    dark: [
      'var(--base950)',
      'var(--base900)',
      'var(--base800)',
      'var(--base700)',
      'var(--base600)',
      'var(--base500)',
      'var(--base400)',
      'var(--base300)',
      'var(--base200)',
      'var(--base100)',
    ],
  },
  fontSizes: {
    xs: 'var(--a00)',
    sm: 'var(--a0)',
    md: 'var(--a1)',
    lg: 'var(--a2)',
    xl: 'var(--a3)',
  },
});

export default theme;
