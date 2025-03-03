"use client"
import { bool } from "prop-types";
import {AppShellHeader, Button} from '@mantine/core'
import Title from "./Title";
import EsaLogo from "@features/(processes)/_components/EsaLogo";
import "./style.css";
import { useUserInfoFromIdentity } from "@features/(shared)/_hooks/user.useUserInfoFromIdentity";
import {IconLogout} from "@tabler/icons-react";

const Header = () => {

  const { isLoading, userInfoValue } = useUserInfoFromIdentity("api/auth/user-info")

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
                <>
                  <span className="worldCereal-Header-email">{userInfoValue.email} </span>
                  <Button
                      leftSection={<IconLogout size={14} />}
                      className="worldCereal-Button is-secondary is-ghost"
                      size="sm"
                      component="a"
                      target="_blank"
                      variant="outline"
                      href="api/auth/logout"
                  >
                    Logout
                  </Button>
                </>
          }
        </div>
      </div>
    </AppShellHeader>
  );
};

Header.propTypes = {
  tourGuideIsOpen: bool,
};

export default Header;
