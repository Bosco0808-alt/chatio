"use client";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import useRedirectIfNotLoggedIn from "@/utils/useredirectifnotloggedin";

interface FriendRequest {
  id: string;
  authorId: string;
  recieverId: string;
  [key: string]: any;
}

interface ResBody {
  error: boolean;
  message: string;
  friendRequests: FriendRequest[] | undefined;
}

type viewing = "recieved" | "sent";

const FriendRequests = () => {
  useRedirectIfNotLoggedIn();
  const [viewing, setViewing] = useState<viewing>("recieved");
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  useEffect(() => {
    (async () => {
      const headerList = new Headers();
      headerList.set("Authorization", process.env.NEXT_PUBLIC_AUTHKEY || "");
      const res = await fetch(
        `/api/get${viewing === "recieved" ? "" : "sent"}friendrequests`,
        {
          headers: headerList,
        }
      );
      const { error, message, friendRequests }: ResBody = await res.json();
      if (error) console.error(error);
      setFriendRequests(friendRequests || []);
    })();
  }, [viewing]);

  return (
    <>
      <h1 className="m-2">Friend Requests</h1>

      {friendRequests.length !== 0 ? (
        <ul>
          {friendRequests.map((friendRequest) => (
            <li key={friendRequest.id}>{friendRequest.username}</li>
          ))}
        </ul>
      ) : (
        <span className="m-2">No friend requests</span>
      )}
      <br />
      <button
        className="btn btn-primary m-2"
        onClick={() =>
          setViewing((prevViewing) =>
            prevViewing === "recieved" ? "sent" : "recieved"
          )
        }
      >
        {viewing === "recieved"
          ? "View sent requests"
          : "View recieved requests"}
      </button>

      <br className="d-sm-none" />
      <Link href={"/chat"} className="btn btn-danger m-2">
        Back to chat
      </Link>
    </>
  );
};

export default FriendRequests;
