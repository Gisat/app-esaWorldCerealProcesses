import "./style.css";
import { Text } from '@mantine/core';

/**
 * TextParagraph component.
 * 
 * @param {Object} props - The props for the TextParagraph component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the paragraph.
 * @param {string} [props.color] - The color of the paragraph text.
 * @returns {JSX.Element} The rendered TextParagraph component.
 */
export const TextParagraph = ({ children, color = "var(--textPrimaryColor)" }: Readonly<{
  children: React.ReactNode;
  color?: string;
}>) => {
  return (
    <Text className="worldCereal-TextParagraph" c={color}>
      {children}
    </Text>
  );
};