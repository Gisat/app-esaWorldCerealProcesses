import "./style.css";
import { Container } from '@mantine/core';

/**
 * SectionContainer component.
 * 
 * @param {Object} props - The props for the SectionContainer component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the container.
 * @returns {JSX.Element} The rendered SectionContainer component.
 */
export const SectionContainer = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className="worldCereal-SectionContainer">
      {children}
    </Container>
  );
};