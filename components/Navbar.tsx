import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-light fixed-top">
      <Link className="navbar-brand m-2" href={"/"}>
        Chatio
      </Link>
      <Link className="navbar-nav nav-item nav-link m-2" href={"/createuser"}>
        Create user
      </Link>
      <Link className="navbar-nav nav-item nav-link m-2" href={"/login"}>
        Login
      </Link>
    </nav>
  );
};

export default Navbar;
