import Link from "next/link";

export default function Home() {
  return (
    <div className="m-2 ">
      <h1>Chatio</h1>
      <p>A small chat app that helps you send messages</p>
      <Link href={"/createuser"} className="btn btn-primary">
        Get started!
      </Link>
    </div>
  );
}
