"use client";

import { friendsAtom } from "@/atomconfig";
import { default as SideBar } from "@/components/FriendsSidebar";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const [_friends] = useAtom(friendsAtom);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const router = useRouter();
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener to track window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth > 768) {
      router.replace("/chat");
    }
  }, [windowWidth]);
  return (
    <div className="m-2">
      <SideBar _friends={_friends} />
    </div>
  );
};

export default Sidebar;
