import NavbarSkeleton from "./NavbarSkeleton";

interface NavbarProps {
  auth: boolean;
  username: string | undefined;
}

async function Navbar({ auth, username }: NavbarProps) {
  return <NavbarSkeleton auth={auth} username={username} />;
}

export default Navbar;
