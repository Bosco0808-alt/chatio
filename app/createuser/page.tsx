"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import swal from "@/lib/sweetalert";
import Link from "next/link";
import { usernameAtom, authAtom } from "@/atomconfig";
import { useAtom } from "jotai";

type code =
  | "BAD_REQUEST_BODY"
  | "ERR_NOT_AUTHENICATED"
  | "USERNAME_CONFLICT"
  | "SUCCESS";

interface Resbody {
  error: boolean;
  code: code;
}

const Createuser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [_auth, set_auth] = useAtom(authAtom);
  const [_username, set_username] = useAtom(usernameAtom);
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled(true);
    if (!username || !password) {
      await swal.fire({
        icon: "error",
        title: "Username or password not provided",
        text: "Please enter username and  password",
      });
      setDisabled(false);
      return;
    }

    // create user
    const headers = new Headers();
    headers.append("Authorization", process.env.NEXT_PUBLIC_AUTHKEY || "");
    const res = await fetch("/api/createuser", {
      method: "POST",
      headers,
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const { error, code }: Resbody = await res.json();

    // success
    if (!error) {
      await swal.fire({
        icon: "success",
        title: "User created successfully",
      });
      set_auth(true);
      set_username(username);
      router.push("/chat");

      return;
    }
    // error

    // username conflict
    if (code === "USERNAME_CONFLICT") {
      await swal.fire({
        icon: "error",
        title: "Invalid username",
        text: "Username is already taken",
      });
      setDisabled(false);
      return;
    }

    // other errors
    await swal.fire({
      icon: "error",
      title: "Oops, an error occured.",
      text: process.env.NODE_ENV === "production" ? undefined : code,
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="m-2">Username:</label>
        <input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control m-2"
          required
        />
        <label className="m-2">password:</label>
        <input
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control m-2"
          type="password"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary m-2" disabled={disabled}>
        {disabled ? (
          <span
            className="spinner-border spinner-border-sm"
            style={{ marginRight: "5px" }}
          ></span>
        ) : (
          ""
        )}
        Create user
      </button>
      <br />
      <br />
      <span className="m-2">
        Already have an account? <Link href={"/login"}>login</Link>
      </span>
    </form>
  );
};

export default Createuser;
