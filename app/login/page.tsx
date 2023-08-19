"use client";
import Link from "next/link";
import { useState, FormEvent, useTransition } from "react";
import swal from "@/lib/sweetalert";
import { login } from "../actions";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [, startTransition] = useTransition();
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
    startTransition(async () => {
      const { error } = await login(username, password);
      if (error) {
        await swal.fire({
          icon: "error",
          title: "Username or password incorrect!",
        });
        setDisabled(false);
        return;
      }
      router.push("/chat");
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
