import Link from "next/link";
import verify from "@/utils/verify";

interface Resbody {
  error: boolean;
  auth: boolean;
  username: string | undefined;
  password: string | undefined;
}

async function Navbar() {
  const { auth, error, username, password }: Resbody = await verify();
  return (
    <nav className="navbar navbar-light bg-light fixed-top">
      <Link href="/" className="navbar-brand m-2">
        Chatio
      </Link>
      <Link href="/createuser" className="navbar-nav nav-item nav-link m-2">
        Create user
      </Link>
      <Link href="/login" className="navbar-nav nav-item nav-link m-2">
        {username}Login
      </Link>
    </nav>
  );
}

export default Navbar;
