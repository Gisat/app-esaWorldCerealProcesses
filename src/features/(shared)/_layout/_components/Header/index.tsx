"use client";
import EsaLogo from "@features/(processes)/_components/EsaLogo";
import { AppShellHeader, Button } from "@mantine/core";
import { IconLogout, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { bool } from "prop-types";
import "./style.css";
import Title from "./Title";
import { useUserInfoFromIdentity } from "@features/(shared)/_hooks/user.useUserInfoFromIdentity";

const Header = () => {
  const { isLoading, userInfoValue, error } = useUserInfoFromIdentity("/api/auth/user-info");
  
  if (isLoading) return null;

  if (error) console.error("Error fetching user info", error);
  
  return (
    <AppShellHeader>
      <div className="worldCereal-Header">
        <Title />
        <div className="worldCereal-Header-tools">
          <EsaLogo className="worldCereal-Header-esaLogo" />
          {!userInfoValue?.email ? (
            <Link href="/api/auth/iam">
              <Button
                className="worldCereal-Button"
                autoContrast
                leftSection={<IconUser size={14} />}
                size="sm"
              >
                Login/Sign up
              </Button>
            </Link>
          ) : (
            <>
              <span className="worldCereal-Header-email">
                {userInfoValue?.email ?? "unknown"}
              </span>
              <Button
                leftSection={<IconLogout size={14} />}
                className="worldCereal-Button is-secondary is-ghost"
                size="sm"
                component="a"
                variant="outline"
                href="api/auth/logout"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </AppShellHeader>
  );
};

Header.propTypes = {
  tourGuideIsOpen: bool,
};

export default Header;
