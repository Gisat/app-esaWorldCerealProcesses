"use client";
import EsaLogo from "@features/(processes)/_components/EsaLogo";
import { useIsLoggedIn } from "@features/(shared)/_hooks/user.isLogged";
import { AppShellHeader, Button } from "@mantine/core";
import { IconLogout, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { bool } from "prop-types";
import "./style.css";
import Title from "./Title";

const Header = () => {
  const { isLoading, isLoggedIn, userInfoValue } =
    useIsLoggedIn("api/auth/user-info");

  if (isLoading) return null;

  console.log("aa", isLoggedIn());

  return (
    <AppShellHeader>
      <div className="worldCereal-Header">
        <Title />
        <div className="worldCereal-Header-tools">
          <EsaLogo className="worldCereal-Header-esaLogo" />
          {!isLoggedIn() ? (
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
                {userInfoValue?.email}{" "}
              </span>
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
