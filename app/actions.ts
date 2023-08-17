"use server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { cookies } from "next/headers";
const cookie = cookies();

export const createuser = async (username: string, password: string) => {
  const hash = crypto
    .pbkdf2Sync(password, process.env.SALT || "testSalt", 100000, 64, "sha512")
    .toString("hex");
  await prisma.user.create({
    data: {
      username,
      password: hash,
    },
  });
  cookie.set("username", username, {
    path: "/",
    expires: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  });
  cookie.set("password", hash, {
    path: "/",
    expires: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  });
};
