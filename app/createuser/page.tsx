"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import swal from "@/lib/sweetalert";
interface CreateUserResBody {
  badRequest: boolean | undefined | null;
  hash: string | undefined;
}

interface SetCookieResBody {
  badRequest: boolean | undefined | null;
}

const Createuser = () => {
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
    const res = await fetch("/api/createuser", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const { badRequest, hash }: CreateUserResBody = await res.json();
    if (badRequest) {
      await swal.fire({
        icon: "error",
        title: "Oops, there is an error",
        text:
          process.env.NODE_ENV === "production"
            ? undefined
            : "create user failed",
      });
      return;
    }
    const res2 = await fetch("/api/setcookies", {
      method: "POST",
      body: JSON.stringify({
        username,
        hash,
      }),
    });
    const { badRequest: badRequest2 }: SetCookieResBody = await res2.json();
    if (badRequest2) {
      await swal.fire({
        icon: "error",
        title: "Oops, there is an error",
        text:
          process.env.NODE_ENV === "production"
            ? undefined
            : "set cookies failed",
      });
      return;
    }
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
    </form>
  );
};

export default Createuser;
