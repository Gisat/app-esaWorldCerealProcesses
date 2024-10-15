"use client"

import PropTypes from "prop-types";
import { AppShellHeader } from '@mantine/core'
import Title from "../Title";
import EsaLogo from "../../../atoms/EsaLogo";
import "./style.scss";
import Cookies from 'js-cookie';
import { IAM_CONSTANTS } from "@/app/(auth)/_logic/models.auth";
import { useEffect, useState } from "react";
import { Unsure } from "@/app/(shared)/_logic/types.universal";
import Link from "next/link";

const Header = () => {
  // just basic implementation, later we need more robust cookie management for identity and backend cooperation
  const [cookieValue, setCookieValue] = useState<Unsure<string>>(undefined);

  useEffect(() => {
    // Read the cookie
    const value = Cookies.get(IAM_CONSTANTS.Cookie_Email);
    setCookieValue(value);
  }, []);

  /**
   * Delete FE controlled cookie
   * HttpOnly must be done by redirest to auth API route
   */
  const deleteCookieFe = () => {
    Cookies.remove(IAM_CONSTANTS.Cookie_Email)
    setCookieValue(undefined)
  }

  return (
    <AppShellHeader >
      <div className="worldCereal-Header">
        <Title />
        <div className="worldCereal-Header-tools">
          {
            !cookieValue ?
              <>
                <Link href="/account/login">Login</Link>
              </> :
              <>
                <span>{cookieValue}</span>
                <Link href="/api/auth/logout" onClick={deleteCookieFe}>Logout</Link>
              </>
          }
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
