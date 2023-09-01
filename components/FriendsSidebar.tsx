"use client";
import Link from "next/link";
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
      {_friends.length !== 0 ? (
        _friends.map((f) => <div className="sidebar-item">{f.username}</div>)
      ) : (
        <div className="sidebar-item">You have no friends</div>
      )}
      <button className="btn btn-primary sidebar-item mt-2">add friend</button>
      <br />
      <Link
        className="btn btn-secondary sidebar-item mt-2"
        href={"/friendrequest"}
      >
        view friend requests
      </Link>
    </div>
  );
};

export default Sidebar;
