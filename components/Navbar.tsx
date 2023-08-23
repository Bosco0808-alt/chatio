import verify from "@/utils/verify";
import NavbarSkeleton from "./NavbarSkeleton";

interface Resbody {
  error: boolean;
  auth: boolean;
  username: string | undefined;
}

async function Navbar() {
  const { auth, error, username }: Resbody = await verify();
  return <NavbarSkeleton auth={auth} username={username} />;
}

export default Navbar;
