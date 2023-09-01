"use client";
import swal from "@/lib/sweetalert";
import { useEffect } from "react";
import { useState } from "react";
import useRedirectIfNotLoggedIn from "@/utils/useredirectifnotloggedin";

interface FriendRequest {
  id: string;
  authorId: string;
  recieverId: string;
}

interface ResBody {
  error: boolean;
  message: string;
  friendRequests: FriendRequest[] | undefined;
}

const FriendRequests = () => {
  useRedirectIfNotLoggedIn();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  useEffect(() => {
    (async () => {
      const headerList = new Headers();
      headerList.set("Authorization", process.env.NEXT_PUBLIC_AUTHKEY || "");
      const res = await fetch("/api/getfriendrequests", {
        headers: headerList,
      });
      const { error, message, friendRequests }: ResBody = await res.json();
      if (error) {
        console.error(message);
        return;
      }
      setFriendRequests(friendRequests || []);
    })();
  }, []);

  return (
    <>
      <h1 className="m-2">Friend Requests</h1>

      {friendRequests.length !== 0 ? (
        <ul>
          {friendRequests.map((friendRequest) => (
            <li key={friendRequest.id}>{friendRequest.authorId}</li>
          ))}
        </ul>
      ) : (
        <span className="m-2">No friend requests</span>
      )}
    </>
  );
};

export default FriendRequests;
