"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  addCookieChangeListener,
  removeCookieChangeListener,
} from "@/lib/cookiemanager";
import Cookies from "js-cookie";
import swal from "@/lib/sweetalert";

const LoginButton = () => {
  const [cookieValue, setCookieValue] = useState(Cookies.get("username"));
  const auth = useMemo(() => Boolean(cookieValue), [cookieValue]);
  useEffect(() => {
    const handleCookieChange = () => {
      setCookieValue(Cookies.get("username"));
    };

    addCookieChangeListener(handleCookieChange);

    return () => {
      removeCookieChangeListener(handleCookieChange);
    };
  }, []);
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
