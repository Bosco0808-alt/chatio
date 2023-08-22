"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import swal from "@/lib/sweetalert";

interface LoginButtonProps {
  auth: boolean;
}

const LoginButton: FC<LoginButtonProps> = ({ auth }: LoginButtonProps) => {
  const router = useRouter();
  const onClick = async () => {
    if (!auth) {
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
      } catch (e) {
        return;
      }
    }
  };
  return (
    <button onClick={onClick} className="btn btn-primary">
      {auth ? "logout" : "login"}
    </button>
  );
};

export default LoginButton;
