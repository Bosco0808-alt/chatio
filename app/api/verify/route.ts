import { cookies, headers } from "next/headers";
import prisma from "@/lib/prisma";
import { pbkdf2Sync, timingSafeEqual } from "crypto";

export async function GET(req: Request) {
  if (headers().get("Authorization") !== process.env.NEXT_PUBLIC_AUTHKEY) {
    return new Response(
      JSON.stringify({
        error: true,
        auth: undefined,
        username: undefined,
        password: undefined,
      }),
      { status: 401 }
    );
  }
  const cookie = cookies();
  const username = cookie.get("username")?.value;
  const password = cookie.get("password")?.value;
  if (!username || !password) {
    JSON.stringify({
      error: false,
      auth: false,
      username,
      password,
    });
  }
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) {
    return new Response(
      JSON.stringify({
        error: false,
        auth: false,
        username,
        password,
      }),
      { status: 404 }
    );
  }
  const hash = pbkdf2Sync(
    password || "",
    process.env.SALT || "testSalt",
    100000,
    64,
    "sha512"
  ).toString("hex");
  const auth = timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(user.password, "hex")
  );
  return new Response(
    JSON.stringify({
      error: false,
      auth,
      username,
      password,
    }),
    { status: auth ? 200 : 401 }
  );
}
