"use client";
import swal from "@/lib/sweetalert";

import useRedirectIfNotLoggedIn from "@/utils/useredirectifnotloggedin";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface ResBody {
  error: boolean;
  message: string;
}

const AddFriend = () => {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  useRedirectIfNotLoggedIn();
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    if (!username || !description) {
      await swal.fire({
        icon: "error",
        title: "Username or description required",
      });
      return;
    }
    const res = await fetch("/api/addfriendrequest", {
      method: "POST",
      headers: new Headers({
        Authorization: process.env.NEXT_PUBLIC_AUTHKEY || "",
      }),
      body: JSON.stringify({
        recieverusername: username.trim(),
        description,
      }),
    });
    const { error, message }: ResBody = await res.json();
    if (error) {
      if (message === "USER_NOT_FOUND") {
        await swal.fire({
          icon: "error",
          title: "The user you wish to friend was not found",
          text: "Check for any typos in the username",
        });
        return;
      }
      if (message === "SELF_FRIEND") {
        await swal.fire({
          icon: "error",
          title: "You cannot friend yourself",
        });
        return;
      }
      if (message === "FRIEND_REQUEST_ALREADY_EXISTS") {
        await swal.fire({
          icon: "error",
          title: "Friend request already exists",
        });
        return;
      }
      if (message === "ALREADY_FRIENDED") {
        await swal.fire({
          icon: "error",
          title: "You are already friends with this user",
        });
        return;
      }
      // TODO: error handling for refriending
      await swal.fire({
        icon: "error",
        title: "Oops, an error occurred",
      });
      return;
    }
    await swal.fire({
      icon: "success",
      title: "Friend request sent",
      text: "Wait for your friend to accept it!",
    });
    router.back();
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="form-gruop">
        <label className="m-2">Enter friend username:</label>{" "}
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          className="form-control m-2"
          placeholder="Enter friend username"
          required
        />
      </div>
      <div className="form-gruop">
        <label className="m-2">Enter self description:</label>{" "}
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          className="form-control m-2"
          placeholder="Enter self description"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary m-2" disabled={disabled}>
        Add Friend
        {disabled ? (
          <span className="spinner-border spinner-border-sm"></span>
        ) : (
          ""
        )}
      </button>
    </form>
  );
};

export default AddFriend;
