"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Container, Space, Alert, Center } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';


export default function Home() {

  const router = useRouter()


  return (
    <div >
      <Space h="xl" />
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
      </Container>
    </div>
  );
}
