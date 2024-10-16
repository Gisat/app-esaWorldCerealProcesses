"use client";

import Link from "next/link";

import { useState } from "react";
import { Unsure } from "@/app/(shared)/_logic/types.universal";
import { useRouter } from "next/navigation";
import { pages } from "@/constants/app";
import { Button, Container, Space, Alert, Center } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';


export default function Home() {

  // just basic implementation, later we need more robust cookie management for identity and backend cooperation
  const [cookieValue, setCookieValue] = useState<Unsure<string>>(undefined);
  const router = useRouter()

  if (cookieValue) {
    // if (true) {
    router.push("/" + pages.processesList.url)
  }

  return (
    <div >
      <Space h="xl" />
      {!cookieValue ?
        <Container fluid h={50}>
          <Center >

            <Alert variant="transparent">
              <p>
                A login is required for this part of the application. After clicking the button you will be redirected to the login section.
              </p>
              <Space h="sm" />
              {/* <Link href="/account/login" ><Button>Login</Button></Link> */}
              <Link href="/api/auth/iam" ><Button autoContrast leftSection={<IconUser size={14} />}>Login</Button></Link>

            </Alert>
          </Center>
        </Container> : null}
    </div>
  );
}
