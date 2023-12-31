"use client";

import { friendsAtom } from "@/atomconfig";
import { useAtom } from "jotai";
import Sidebar from "@/components/FriendsSidebar";
import ChatInterface from "@/components/ChatInterface";
import useRedirectIfNotLoggedIn from "@/utils/useredirectifnotloggedin";
import Link from "next/link";

const Chat = () => {
  useRedirectIfNotLoggedIn();
  const [_friends] = useAtom(friendsAtom);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 d-none d-md-block">
          <Sidebar _friends={_friends}></Sidebar>
        </div>
        <div className="col-md-2 d-block d-md-none">
          <Link href={"/sidebar"} className="btn btn-secondary">
            Show sidebar
          </Link>
        </div>

        <div className="col-md-10">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Chat;
