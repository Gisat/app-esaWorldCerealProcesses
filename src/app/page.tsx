"use client";

import Link from "next/link";

import { useState } from "react";
import { Unsure } from "@/app/(shared)/_logic/types.universal";
import { useRouter } from "next/navigation";
import { pages } from "@/constants/app";
import { Button } from '@mantine/core';

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
      {!cookieValue ?
        <>
          A login is required for this part of the application. After clicking the button you will be redirected to the login section.
          <Link href="/account/login" ><Button>Login</Button></Link>
        </> : null}
    </div>
  );
}
