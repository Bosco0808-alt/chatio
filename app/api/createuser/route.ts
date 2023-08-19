import prisma from "@/lib/prisma";
import { pbkdf2Sync } from "crypto";
import { cookies, headers } from "next/headers";

interface ReqBody {
  username: string;
  password: string;
}

export async function POST(req: Request) {
  const authkey = headers().get("Authorization");
  const { username, password }: ReqBody = await req.json();
  const cookie = cookies();
  if (!username || !password || !authkey) {
    return new Response(
      JSON.stringify({
        error: true,
        code: "BAD_REQUEST_BODY",
      }),
      { status: 400 }
    );
  }
  if (authkey !== process.env.NEXT_PUBLIC_AUTHKEY) {
    return new Response(
      JSON.stringify({
        error: true,
        code: "ERR_NOT_AUTHENICATED",
      }),
      { status: 401 }
    );
  }
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (user) {
    return new Response(
      JSON.stringify({
        error: true,
        code: "USERNAME_CONFLICT",
      }),
      { status: 409 }
    );
  }
  const hash = pbkdf2Sync(
    password,
    process.env.SALT || "testSalt",
    100000,
    64,
    "sha512"
  ).toString("hex");
  await prisma.user.create({
    data: {
      username,
      password: hash,
    },
  });
  cookie.set({
    name: "username",
    value: username,
    expires: Date.now() + 24 * 60 * 60 * 1000,
  });
  cookie.set({
    name: "password",
    value: hash,
    expires: Date.now() + 24 * 60 * 60 * 1000,
  });
  return new Response(JSON.stringify({ error: false, code: "SUCCESS" }));
}
