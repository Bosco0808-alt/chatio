"use client";
import { FC } from "react";
interface SidebarProps {
  _friends: {
    id: string;
    username: string;
  }[];
}

const Sidebar: FC<SidebarProps> = (props: SidebarProps) => {
  return (
    <div
      className="sidebar bg-light"
      style={{
        height: "100vh",
      }}
    >
      <div className="fs-3">Friends</div>
      <br />
      {props._friends.length !== 0
        ? props._friends.map((f) => (
            <div className="sidebar-item">{f.username}</div>
          ))
        : "You have no friends"}
    </div>
  );
};

export default Sidebar;
