import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const cookieList = cookies();
  const headerList = headers();
  const authkey = headerList.get("Authorization");
  if (!authkey || authkey !== process.env.NEXT_PUBLIC_AUTHKEY) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "AUTHKEY_ERROR",
      }),
      { status: 401 }
    );
  }
  const username = cookieList.get("username")?.value;
  const password = cookieList.get("password")?.value;

  if (!username || !password) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "NOT_LOGGED_IN",
      }),
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "Unauthorised",
      }),
      { status: 401 }
    );
  }
  const authorised = timingSafeEqual(
    Buffer.from(password),
    Buffer.from(user.password)
  );
  if (!authorised) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "Unauthorised",
      }),
      { status: 401 }
    );
  }
  const friendRequests = await prisma.friendRequest.findMany();
  return new Response(
    JSON.stringify({
      error: false,
      message: "SUCCESS",
      friendRequests,
    })
  );
}
