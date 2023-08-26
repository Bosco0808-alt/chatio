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
      friends: [],
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      friends: true,
    },
  });
  if (!user) {
    return {
      error: false,
      auth: false,
      username,
      friends: [],
    };
  }
  const auth = timingSafeEqual(
    Buffer.from(password || "", "hex"),
    Buffer.from(user.password, "hex")
  );

  const { friends: _friends } = user;
  const friends = _friends.map((f) => {
    const { password, ...friend } = f;
    return friend;
  });
  return {
    error: false,
    auth,
    username,
    friends: auth ? friends : [],
  };
}
