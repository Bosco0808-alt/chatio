"use client";

import { friendsAtom } from "@/atomconfig";
import { useAtom } from "jotai";
import { useEffect } from "react";

const Chat = () => {
  useEffect(() => {
    console.log(_friends.length);
  });

  const [_friends] = useAtom(friendsAtom);
  const test = ["john", "doe", "sussy"];
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 d-none d-md-block">
          <div
            className="sidebar bg-light"
            style={{
              height: "100vh",
            }}
          >
            <div className="fs-3">Friends</div>
            <br />
            {_friends.length !== 0
              ? _friends.map((f) => (
                  <div className="sidebar-item">{f.username}</div>
                ))
              : "You have no friends"}
          </div>
        </div>

        <div className="col-md-10">
          <h1>Test</h1>
        </div>
      </div>
    </div>
  );
};

export default Chat;
