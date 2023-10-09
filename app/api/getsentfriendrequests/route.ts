import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

interface FriendRequest {
  id: string;
  authorId: string;
  recieverId: string;
  [key: string]: any;
}

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
  const _friendRequests = await prisma.friendRequest.findMany({
    where: {
      authorId: user.id,
    },
  });
  const friendRequests: FriendRequest[] = Array.from(_friendRequests);
  for (let i = 0; i < friendRequests.length; i++) {
    const friendRequest = _friendRequests[i];
    const user = await prisma.user.findUnique({
      where: {
        id: friendRequest.recieverId,
      },
    });

    friendRequests[i].username = user?.username;
  }
  return new Response(
    JSON.stringify({
      error: false,
      message: "SUCCESS",
      friendRequests,
    })
  );
}
