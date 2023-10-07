import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useRedirectIfNotLoggedIn() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/checkloginstatus", {
        headers: new Headers({
          Authorization: process.env.NEXT_PUBLIC_AUTHKEY || "",
        }),
      });
      const { auth } = await res.json();
      if (!auth) {
        router.replace("/");
      }
    })();
  }, []);
}
