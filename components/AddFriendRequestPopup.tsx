"use client";
import { ChangeEvent } from "react";

interface AddFriendRequestPopupProps {
  setParentUsername: (username: string) => void;
  setParentDescription: (description: string) => void;
}

const AddFriendRequestPopup = ({
  setParentUsername,
  setParentDescription,
}: AddFriendRequestPopupProps) => {
  return (
    <>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control m-2"
            id="username"
            placeholder="Enter username"
            onChange={(e) => setParentUsername(e.target.value)}
          />
          <textarea
            className="form-control m-2"
            id="password"
            placeholder="Enter description"
            onChange={(e) => setParentDescription(e.target.value)}
          />
        </div>
      </form>
    </>
  );
};

export default AddFriendRequestPopup;
