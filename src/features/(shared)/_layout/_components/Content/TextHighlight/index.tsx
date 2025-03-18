import { Text } from '@mantine/core';

/**
 * TextHighlight component.
 * 
 * @param {Object} props - The props for the TextHighlight component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the text highlight.
 * @param {boolean} [props.bold] - Whether the text should be bold.
 * @returns {JSX.Element} The rendered TextHighlight component.
 */
export const TextHighlight = ({ children, bold }: Readonly<{
  children: React.ReactNode;
  bold?: boolean;
}>) => {
  return (
    <Text fw={bold ? "bold" : "normal"} c={"var(--textAccentedColor)"} td={"underline"} span>
      {children}
    </Text>
  );
};