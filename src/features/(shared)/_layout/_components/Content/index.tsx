import "./style.css";
import { Container } from '@mantine/core';

const Content = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container fluid={true} className="worldCereal-Content">
      {children}
    </Container>
  );
};

export default Content;
