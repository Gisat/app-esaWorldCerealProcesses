import "./style.css";
import { Text } from '@mantine/core';

/**
 * TextDescription component.
 * 
 * @param {Object} props - The props for the TextDescription component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the paragraph.
 * @param {string} [props.color] - The color of the paragraph text.
 * @returns {JSX.Element} The rendered TextDescription component.
 */
export const TextDescription = ({ children, color = "var(--textPrimaryColor)" }: Readonly<{
  children: React.ReactNode;
  color?: string;
}>) => {
  return (
    <Text className="worldCereal-TextDescription" fz="sm" c={color}>
      {children}
    </Text>
  );
};