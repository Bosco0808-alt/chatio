"use client";

import { useState, FormEvent } from "react";

const Createuser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled(true);
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
        />
        <label className="m-2">password:</label>
        <input
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control m-2"
          type="password"
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
