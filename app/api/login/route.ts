import { headers, cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { pbkdf2Sync, timingSafeEqual } from "crypto";

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
  if (!user) {
    return new Response(
      JSON.stringify({
        error: true,
        code: "INVALID_USERNAME",
      }),
      { status: 404 }
    );
  }
  const hash = pbkdf2Sync(
    password,
    process.env.SALT || "testSalt",
    100000,
    64,
    "sha512"
  ).toString("hex");
  const status = timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(user.password, "hex")
  );
  if (!status) {
    return new Response(
      JSON.stringify({
        error: true,
        code: "PASSWORD_INCORRECT",
      }),
      { status: 401 }
    );
  }
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
  return new Response(
    JSON.stringify({
      error: false,
      code: "SUCCESS",
    })
  );
}
