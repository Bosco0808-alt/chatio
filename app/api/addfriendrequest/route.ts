import { headers, cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { timingSafeEqual } from "crypto";

interface ReqBody {
  recieverUsername: string;
  description: string | null;
}

export async function POST(req: Request) {
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

  if (!username) {
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

  const password = cookieList.get("password")?.value;

  if (
    !password ||
    !user ||
    !timingSafeEqual(Buffer.from(password), Buffer.from(user.password))
  ) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "NOT_LOGGED_IN",
      }),
      { status: 401 }
    );
  }

  const { description, recieverUsername }: ReqBody = await req.json();

  if (!recieverUsername) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "BAD_REQUEST",
      }),
      { status: 400 }
    );
  }

  const reciever = await prisma.user.findUnique({
    where: {
      username: recieverUsername,
    },
  });

  if (!reciever) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "USER_NOT_FOUND",
      }),
      { status: 404 }
    );
  }

  await prisma.friendRequest.create({
    data: {
      author: {
        connect: {
          id: user.id,
        },
      },
      reciever: {
        connect: {
          id: reciever.id,
        },
      },
      description,
    },
  });

  return new Response(
    JSON.stringify({
      error: false,
      message: "SUCCESS",
    })
  );
}
