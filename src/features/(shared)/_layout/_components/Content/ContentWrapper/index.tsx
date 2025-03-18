import "./style.css";
import { Container } from '@mantine/core';

/**
 * ContentWrapper component.
 * 
 * @param {Object} props - The props for the ContentWrapper component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the wrapper.
 * @returns {JSX.Element} The rendered ContentWrapper component.
 */
export const ContentWrapper = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container fluid={true} className="worldCereal-ContentWrapper">
      {children}
    </Container>
  );
};