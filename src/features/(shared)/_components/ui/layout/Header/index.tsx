"use client"
import PropTypes from "prop-types";
import { AppShellHeader } from '@mantine/core'
import Title from "../Title";
import EsaLogo from "../../../../../(processes)/_components/EsaLogo";
import "./style.scss";
import Link from "next/link";
import { useUserInfoFromIdentity } from "@/features/(shared)/_hooks/user.useUserInfoFromIdentity";

const Header = () => {

  const { error, isLoading, userInfoValue } = useUserInfoFromIdentity("api/auth/user-info")

  if (isLoading)
    return null

  return (
    <AppShellHeader >
      <div className="worldCereal-Header">
        <Title />
        <div className="worldCereal-Header-tools">
          <EsaLogo className="worldCereal-Header-esaLogo" />
          {
            (!userInfoValue || !userInfoValue.email) ?
              null :
              <span>{userInfoValue.email} <Link href={"api/auth/logout"}>Logout</Link></span>
          }
        </div>
      </div>
    </AppShellHeader>
  );
};

Header.propTypes = {
  tourGuideIsOpen: PropTypes.bool,
};

export default Header;
