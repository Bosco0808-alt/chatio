"use client";

import AddFriendRequestPopup from "@/components/AddFriendRequestPopup";
import swal from "@/lib/sweetalert";
import { useEffect, useState } from "react";

export default function FriendRequestPopup() {
  const [username, setUsername] = useState("");
  const setParentUsername = (username: string) => {
    setUsername(username);
  };
  const handleClick = async () => {
    const result = await swal.fire({
      html: <AddFriendRequestPopup setParentUsername={setParentUsername} />,
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonText: "Ok",
    });
    if (result.isConfirmed) {
      setParentUsername("");
      await swal.fire({
        text: "Todo: Friend request sent" + username,
        icon: "success",
      });
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
