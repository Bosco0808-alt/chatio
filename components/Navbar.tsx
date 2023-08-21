import Link from "next/link";
import verify from "@/utils/verify";
import LoginButton from "./LoginBtn";

interface Resbody {
  error: boolean;
  auth: boolean;
  username: string | undefined;
}

async function Navbar() {
  const { auth, error, username }: Resbody = await verify();
  return (
    <nav className="navbar navbar-light bg-light fixed-top">
      <Link href="/" className="navbar-brand m-2">
        Chatio
      </Link>
      <Link href="/createuser" className="navbar-nav nav-item nav-link m-2">
        Create user
      </Link>
      <div className="nav-item nav-link m-2">
        <span
          className="mr-2"
          style={{ paddingRight: 50, pointerEvents: "none" }}
        >
          {username}
        </span>
        <LoginButton auth={auth}></LoginButton>
      </div>
    </nav>
  );
}

export default Navbar;
