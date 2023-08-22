"use client";
import Link from "next/link";
import { useState, FormEvent } from "react";
import swal from "@/lib/sweetalert";
import { useRouter } from "next/navigation";
import { usernameAtom, authAtom } from "@/atomconfig";
import { useAtom } from "jotai";

type code =
  | "BAD_REQUEST_BODY"
  | "ERR_NOT_AUTHENICATED"
  | "INVALID_USERNAME"
  | "PASSWORD_INCORRECT"
  | "SUCCESS";

interface Resbody {
  code: code;
  error: boolean;
}

const Login = () => {
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
    const headers = new Headers();
    headers.append("Authorization", process.env.NEXT_PUBLIC_AUTHKEY || "");
    const res = await fetch("/api/login", {
      method: "POST",
      headers,
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const { code, error }: Resbody = await res.json();
    if (!error) {
      await swal.fire({
        icon: "success",
        title: "Login successful",
      });
      set_auth(true);
      set_username(username);
      router.push("/chat");
      return;
    }
    if (code === "INVALID_USERNAME" || code === "PASSWORD_INCORRECT") {
      await swal.fire({
        icon: "error",
        title: "Username or password incorrect",
      });
      setDisabled(false);
      return;
    }
    await swal.fire({
      icon: "error",
      title: "Oops, an error occured!",
      text: process.env.NODE_ENV === "production" ? undefined : code,
    });
    return;
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
        Login
      </button>
      <br />
      <br />
      <span className="m-2">
        Don't have an account? <Link href={"/createuser"}>Create user</Link>
      </span>
    </form>
  );
};

export default Login;
