"use client";
import { useEffect } from "react";
import { useState } from "react";
import useRedirectIfNotLoggedIn from "@/utils/useredirectifnotloggedin";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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

type viewing = "recieved" | "sent";

const FriendRequests = () => {
  const router = useRouter();
  // @ts-ignore
  const viewing: viewing = useSearchParams().get("viewing") || "";
  useRedirectIfNotLoggedIn();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  useEffect(() => {
    if (viewing !== "recieved" && viewing !== "sent") {
      console.warn("viewing is not recieved or sent");
      router.replace("/");
      return;
    }
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
      <br />
      <Link
        className="btn btn-primary m-2"
        href={`/friendrequests?viewing=${
          viewing === "recieved" ? "sent" : "recieved"
        }`}
      >
        {viewing === "recieved"
          ? "View sent requests"
          : "View recieved requests"}
      </Link>

      <br className="d-sm-none" />
      <Link href={"/chat"} className="btn btn-danger m-2">
        Back to chat
      </Link>
    </>
  );
};

export default FriendRequests;
