import { Unsure } from "@/app/(shared)/_logic/types.universal";
import { Button } from "@mantine/core";
import Link from "next/link";

export default (props: { cookieValue: Unsure<string>, deleteCookieFunc: () => void }) => {
  const { cookieValue, deleteCookieFunc } = props
  return (
    !cookieValue ?
      <>
        <Link href="/account/login">
          <Button variant="subtle" className="worldCereal-Button worldCereal-SecondaryButton">Log in</Button>
        </Link>
      </> :
      <>
        <span>{cookieValue}</span>
        <Link href="/api/auth/logout" onClick={deleteCookieFunc}>
          <Button variant="subtle" className="worldCereal-Button worldCereal-SecondaryButton">Log out</Button>
        </Link>
      </>
  )

}