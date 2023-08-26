import { atom } from "jotai";

type friend = {
  id: string;
  username: string;
};

type message = {
  author: string;
  reciever: string;
  content: string;
};

export const usernameAtom = atom("");
export const authAtom = atom<boolean>(false);
export const friendsAtom = atom<friend[]>([]);
export const messagesAtom = atom<message[]>([]);
