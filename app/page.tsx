"use client";

import Link from "next/link";
import useRedirectIfLoggedIn from "@/utils/useredirectifloggedin";

export default function Home() {
  useRedirectIfLoggedIn();
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
