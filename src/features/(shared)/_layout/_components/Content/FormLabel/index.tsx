import "./style.css";
/**
 * FormLabel component that wraps its children in a div with a specific class.
 *
 * @param {Object} props - The props for the FormLabel component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the FormLabel.
 * @returns {JSX.Element} A div containing the children wrapped in a styled container.
 */
const FormLabel = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
	return (
		<div className="worldCereal-FormLabel">
			{children}
		</div>
	);
};
export default FormLabel;