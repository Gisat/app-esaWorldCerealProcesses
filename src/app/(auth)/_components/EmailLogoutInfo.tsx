import { Unsure } from "@/app/(shared)/_logic/types.universal";
import { Button } from "@mantine/core";
import Link from "next/link";

export default ({ cookieValue }: { cookieValue: Unsure<string> }) => {
  return (
    !cookieValue ?
      // <>
      //   <Link href="/account/login">
      //     <Button variant="subtle" className="worldCereal-Button worldCereal-SecondaryButton">Log in</Button>
      //   </Link>
      // </> :
      null :
      <>
        <span>{cookieValue}</span>
        <Link href="/api/auth/logout">
          <Button variant="subtle" className="worldCereal-Button worldCereal-SecondaryButton">Log out</Button>
        </Link>
      </>
  )

}