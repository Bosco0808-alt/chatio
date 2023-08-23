"use client";

import Link from "next/link";
import { authAtom } from "@/atomconfig";
import { useAtom } from "jotai";
import useRedirectIfLoggedIn from "@/utils/useredirectifloggedin";
import { useRouter } from "next/navigation";

export default function Home() {
  const [_auth] = useAtom(authAtom);
  const router = useRouter();
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
