"use client";

import Link from "next/link";
import {Button, Flex} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useUserInfoFromIdentity } from "@features/(shared)/_hooks/user.useUserInfoFromIdentity";
import PageLoader from "@features/(shared)/_components/PageLoader";

export default function Home() {

  const { isLoading, userInfoValue } = useUserInfoFromIdentity("api/auth/user-info")

  if (isLoading)
    return (
      <PageLoader />
    )

  return (
    <Flex direction="column" className="worldCereal-Home">
      {
        (!userInfoValue || !userInfoValue.email) ?
            <>
              <p>
                A login is required for this part of the application. After
                clicking the button you will be redirected to the login section.
              </p>
              {/* <Link href="/account/login" ><Button>Login</Button></Link> */}
              <Link href="/api/auth/iam"><Button className="worldCereal-Button"
                                                 autoContrast
                                                 leftSection={<IconUser
                                                     size={14}/>}>Login</Button></Link>
            </>
            : null
      }
    </Flex>
  );
}
