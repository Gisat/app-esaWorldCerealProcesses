import "./style.scss";

const FormLabel = ({children}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<div className="worldCereal-FormLabel">
			{children}
		</div>
	);
};

export default FormLabel;
