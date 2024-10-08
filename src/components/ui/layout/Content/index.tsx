import "./style.scss";

const Content = ({children}: Readonly<{
    children: React.ReactNode;
}>) => {
  return (
    <div className="worldCereal-Content">
        {children}
    </div>
  );
};

export default Content;
