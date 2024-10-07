import PropTypes from "prop-types";
import Title from "../Title";
import EsaLogo from "../../../atoms/EsaLogo";
import "./style.scss";

const Header = () => {
  return (
    <div className="worldCereal-Header">
      <Title />
      <div className="worldCereal-Header-tools">
        <EsaLogo className="worldCereal-Header-esaLogo" />
      </div>
    </div>
  );
};

Header.propTypes = {
  tourGuideIsOpen: PropTypes.bool,
};

export default Header;
