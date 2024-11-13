"use client"

import Cookies from 'js-cookie';
import PropTypes from "prop-types";
import { AppShellHeader } from '@mantine/core'
import Title from "../Title";
import EsaLogo from "../../../atoms/EsaLogo";
import "./style.scss";
import { IAM_CONSTANTS } from "@/app/(auth)/_logic/models.auth";
import { Unsure } from "@/app/(shared)/_logic/types.universal";
import { useState, useEffect } from "react";

const Header = () => {

    // just basic implementation, later we need more robust cookie management for identity and backend cooperation
    const [cookieValue, setCookieValue] = useState<Unsure<string>>(undefined);

    useEffect(() => {
        // Read the cookie
        const value = Cookies.get(IAM_CONSTANTS.Cookie_Email);
        setCookieValue(value);
    }, []);

  return (
    <AppShellHeader >
      <div className="worldCereal-Header">
        <Title />
        <div className="worldCereal-Header-tools">
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
