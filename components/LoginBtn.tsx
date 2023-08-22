"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import swal from "@/lib/sweetalert";
import { authAtom, usernameAtom } from "@/atomconfig";
import { useAtom } from "jotai";

interface LoginButtonProps {
  auth: boolean;
}

const LoginButton: FC<LoginButtonProps> = ({ auth }: LoginButtonProps) => {
  const [_auth, set_auth] = useAtom(authAtom);
  useEffect(() => {
    set_auth(auth);
  }, [auth]);
  const router = useRouter();
  const onClick = async () => {
    if (!_auth) {
      router.push("/login");
      return;
    }
    const result = await swal.fire({
      icon: "question",
      title: "Are you sure to log out?",
      confirmButtonText: "Log out",
      cancelButtonText: "Cancel",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      const headers = new Headers();
      headers.append("Authorization", process.env.NEXT_PUBLIC_AUTHKEY || "");
      try {
        const res = await fetch("/api/logout", { headers });
        const resBody: { error: boolean } = await res.json();
        if (resBody.error) {
          throw ":(";
        }
      } catch (e) {
        console.error(e);
        return;
      }
      set_auth(false);
    }
  };
  return (
    <button onClick={onClick} className="btn btn-primary">
      {_auth ? "logout" : "login"}
    </button>
  );
};

export default LoginButton;
