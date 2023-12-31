"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface SidebarProps {
  _friends: {
    id: string;
    username: string;
  }[];
}

const Sidebar: FC<SidebarProps> = ({ _friends }: SidebarProps) => {
  const router = useRouter()
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
      <Link className="btn btn-primary" href={"/addfriend"}>add friend</Link>
      <br />
      <Link
        className="btn btn-secondary sidebar-item mt-2"
        href={"/friendrequests"}
      >
        view friend requests
      </Link>
    </div>
  );
};

export default Sidebar;
