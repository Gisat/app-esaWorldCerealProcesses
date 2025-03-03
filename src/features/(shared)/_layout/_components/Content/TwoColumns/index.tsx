import "./style.css";

/**
 * Column component.
 * 
 * @param {Object} props - The props for the Column component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the column.
 * @returns {JSX.Element} The rendered Column component.
 */
export const Column = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="worldCereal-Column">
      {children}
    </div>
  );
};

/**
 * TwoColumns component.
 * 
 * @param {Object} props - The props for the TwoColumns component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the two columns.
 * @returns {JSX.Element} The rendered TwoColumns component.
 */
const TwoColumns = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="worldCereal-TwoColumns">
      {children}
    </div>
  );
};

export default TwoColumns;