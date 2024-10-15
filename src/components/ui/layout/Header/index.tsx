import PropTypes from "prop-types";
import { AppShellHeader } from '@mantine/core'
import Title from "../Title";
import EsaLogo from "../../../atoms/EsaLogo";
import "./style.scss";
import { useUserInfoCookie } from "@/app/(auth)/_hooks/useUserInfoFromCookie";
import EmailLogoutInfo from "@/app/(auth)/_components/EmailLogoutInfo";

const Header = () => {
  
  const [cookieValue, deleteCookieFe] = useUserInfoCookie()
  return (
    <AppShellHeader >
      <div className="worldCereal-Header">
        <Title />
        <div className="worldCereal-Header-tools">
          <EmailLogoutInfo cookieValue={cookieValue} deleteCookieFunc={deleteCookieFe} />
          <EsaLogo className="worldCereal-Header-esaLogo" />
        </div>
      </div>
    </AppShellHeader>
  );
};

Header.propTypes = {
  tourGuideIsOpen: PropTypes.bool,
};

export default Header;
