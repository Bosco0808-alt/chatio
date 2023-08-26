import NavbarSkeleton from "./NavbarSkeleton";

interface NavbarProps {
  auth: boolean;
  username: string | undefined;
  friends: {
    id: string;
    username: string;
  }[];
}

async function Navbar({ auth, username, friends }: NavbarProps) {
  return <NavbarSkeleton auth={auth} username={username} friends={friends} />;
}

export default Navbar;
