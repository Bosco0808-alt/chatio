import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";

export default async function verify() {
  const cookie = cookies();
  const username = cookie.get("username")?.value;
  const password = cookie.get("password")?.value;
  if (!username || !password) {
    return {
      error: true,
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
      error: false,
      auth: false,
      username,
      password,
    };
  }
  const auth = timingSafeEqual(
    Buffer.from(password || "", "hex"),
    Buffer.from(user.password, "hex")
  );
  return {
    error: false,
    auth,
    username,
    password,
  };
}
