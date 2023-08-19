"use server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { cookies } from "next/headers";

// login
export const login = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) {
    return {
      error: true,
    };
  }
  const hash = crypto
    .pbkdf2Sync(password, process.env.SALT || "testSalt", 100000, 64, "sha512")
    .toString("hex");
  const status = crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(user.password, "hex")
  );
  if (!status) {
    return {
      error: true,
    };
  }
  setCookies(username, hash);
  return {
    error: false,
  };
};

// verify
export const verify = async () => {
  const username = cookies().get("username")?.value;
  const password = cookies().get("password")?.value;
  if (!username || !password) {
    return {
      auth: false,
      username,
      password,
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) {
    return {
      auth: false,
      username,
      password,
    };
  }
  const hash = crypto
    .pbkdf2Sync(password, process.env.SALT || "testSalt", 100000, 64, "sha512")
    .toString("hex");
  const auth = crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(user.password, "hex")
  );

  return {
    auth,
    username,
    password,
  };
};

// remove cookies
export const removeCookies = () => {
  cookies().delete("username");
  cookies().delete("password");
};

// set cookies
const setCookies = (username: string, hash: string) => {
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
};
