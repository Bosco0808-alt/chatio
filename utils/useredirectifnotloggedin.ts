import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { authAtom } from "@/atomconfig";

export default function useRedirectIfNotLoggedIn() {
  const router = useRouter();
  const [_auth] = useAtom(authAtom);

  useEffect(() => {
    if (!_auth) {
      router.replace("/");
    }
  }, [_auth]);
}
