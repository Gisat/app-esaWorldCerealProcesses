import { node } from "prop-types";
import { MantineProvider } from "@mantine/core";
import theme from "./theme";

const Mantine = ({ children }: { children: any }) => {
  return (
    <MantineProvider theme={theme}>
      {children}
    </MantineProvider>
  );
};

Mantine.propTypes = {
  children: node,
};

export default Mantine;
