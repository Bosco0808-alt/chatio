import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { authAtom } from "@/atomconfig";

// Custom hook for redirecting logged-in users
function useRedirectIfLoggedIn() {
  const router = useRouter();
  const [_auth] = useAtom(authAtom);

  useEffect(() => {
    if (_auth) {
      router.replace("/chat");
    }
  }, [_auth]);
}

export default useRedirectIfLoggedIn;
