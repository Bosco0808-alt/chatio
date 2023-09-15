"use client";

import AddFriendRequestPopup from "@/components/AddFriendRequestPopup";
import swal from "@/lib/sweetalert";
import { useState } from "react";

interface ResBody {
  message: string;
  error: boolean;
}

export default function FriendRequestPopup() {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const handleClick = async () => {
    const result = await swal.fire({
      html: (
        <AddFriendRequestPopup
          setParentUsername={(username: string) => setUsername(username)}
          setParentDescription={(description: string) =>
            setDescription(description)
          }
        />
      ),
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonText: "Ok",
    });
    try {
      if (result.isConfirmed) {
        try {
          const res = await fetch("/api/addfriendrequest", {
            headers: new Headers({
              Authorization: process.env.NEXT_PUBLIC_AUTHKEY || "",
            }),
            method: "POST",
            body: JSON.stringify({
              username,
              description,
            }),
          });
          const { message, error }: ResBody = await res.json();
          if (!res.ok)
            throw new Error("failed to send friend request: " + message);
        } catch (e) {
          console.error(e);
          await swal.fire({
            text: "Friend request failed",
            icon: "error",
          });
          return;
        }
        await swal.fire({
          text: "Friend request sent" + username,
          icon: "success",
        });
      }
    } finally {
      setUsername("");
      setDescription("");
    }
  };
  return (
    <>
      <button
        className="btn btn-primary sidebar-item mt-2"
        onClick={handleClick}
      >
        add friend
      </button>
    </>
  );
}
