"use client";
import { ChangeEvent } from "react";

interface AddFriendRequestPopupProps {
  setParentUsername: (username: string) => void;
}

const AddFriendRequestPopup = ({
  setParentUsername,
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setParentUsername(e.target.value)
            }
          />
        </div>
      </form>
    </>
  );
};

export default AddFriendRequestPopup;
