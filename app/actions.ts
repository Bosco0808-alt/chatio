"use server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { cookies } from "next/headers";

export const createuser = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (user) {
    return {
      error: true,
    };
  }
  const hash = crypto
    .pbkdf2Sync(password, process.env.SALT || "testSalt", 100000, 64, "sha512")
    .toString("hex");
  await prisma.user.create({
    data: {
      username,
      password: hash,
    },
  });
  cookies().set({
    name: "username",
    value: username,
    expires: Date.now() + 60 * 60 * 24 * 1000,
  });
  cookies().set({
    name: "password",
    value: hash,
    expires: Date.now() + 60 * 60 * 24 * 1000,
  });
  return {
    error: false,
  };
};
