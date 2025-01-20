import "./style.scss";

export const Column = ({children}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="worldCereal-Column">
            {children}
        </div>
    );
};

const TwoColumns = ({children}: Readonly<{
    children: React.ReactNode;
}>) => {
  return (
    <div className="worldCereal-TwoColumns">
        {children}
    </div>
  );
};

export default TwoColumns;
