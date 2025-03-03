import { Flex } from '@mantine/core';

/**
 * ContentContainer component.
 * 
 * @param {Object} props - The props for the ContentContainer component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the container.
 * @returns {JSX.Element} The rendered ContentContainer component.
 */
export const ContentContainer = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Flex className="worldCereal-ContentContainer" direction={"column"}>
      {children}
    </Flex>
  );
};