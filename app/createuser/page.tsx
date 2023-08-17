"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createuser } from "../actions";
import { useTransition } from "react";

import swal from "@/lib/sweetalert";
import Link from "next/link";

const Createuser = () => {
  let [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
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
      return;
    }
    startTransition(() => createuser(username, password));
    await swal.fire({
      icon: "success",
      title: "User created successfully",
    });
    router.replace("/todo");
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
