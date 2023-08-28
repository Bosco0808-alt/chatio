"use client";
import { FC } from "react";
interface SidebarProps {
  _friends: {
    id: string;
    username: string;
  }[];
}

const Sidebar: FC<SidebarProps> = ({ _friends }: SidebarProps) => {
  return (
    <div
      className="sidebar bg-light"
      style={{
        height: "100vh",
      }}
    >
      <div className="fs-3">Friends</div>
      <br />
      {_friends.length !== 0
        ? _friends.map((f) => <div className="sidebar-item">{f.username}</div>)
        : "You have no friends"}
    </div>
  );
};

export default Sidebar;
