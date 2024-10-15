import { Unsure } from "@/app/(shared)/_logic/types.universal";
import Link from "next/link";

export default (props: {cookieValue: Unsure<string>, deleteCookieFunc: () => void}) => {
    const {cookieValue, deleteCookieFunc} = props
    return(
        !cookieValue ?
        <>
          <Link href="/account/login">Login</Link>
        </> :
        <>
          <span>{cookieValue}</span>
          <Link href="/api/auth/logout" onClick={deleteCookieFunc}>Logout</Link>
        </>
    )

}