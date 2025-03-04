import "./style.css";
import { Title } from '@mantine/core';

/**
 * SectionHeader component.
 * 
 * @param {Object} props - The props for the SectionHeader component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the header.
 * @returns {JSX.Element} The rendered SectionHeader component.
 */
export const SectionHeader = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Title size={"lg"} className="worldCereal-SectionHeader">
      {children}
    </Title>
  );
};