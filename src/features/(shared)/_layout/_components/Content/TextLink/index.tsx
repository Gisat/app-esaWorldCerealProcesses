import "./style.css";
import { Anchor } from '@mantine/core';

/**
 * TextLink component.
 * 
 * @param {Object} props - The props for the TextLink component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the link.
 * @param {string} props.url - The URL to which the link should point.
 * @param {string} [props.color] - The color of the link text.
 * @returns {JSX.Element} The rendered TextLink component.
 */
export const TextLink = ({ children, url, color = "var(--textAccentedColor)" }: Readonly<{
  children: React.ReactNode;
  url: string;
  color?: string;
}>) => {
  return (
    <Anchor href={url} target="_blank" c={color} underline="always" fz={"inherit"}>
      {children}
    </Anchor>
  );
};