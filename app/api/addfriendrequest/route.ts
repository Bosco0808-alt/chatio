import { headers, cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { timingSafeEqual } from "crypto";

interface ReqBody {
  recieverusername: string;
  description: string;
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
    include: {
      friends: true,
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

  const { recieverusername, description }: ReqBody = await req.json();

  if (!recieverusername || !description) {
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
      username: recieverusername,
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
  const friendrequestalreadyexists = await prisma.friendRequest.findFirst({
    where: {
      author: {
        id: user.id,
      },
      AND: {
        reciever: {
          id: reciever.id,
        },
      },
    },
  });
  if (recieverusername === username) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "SELF_FRIEND",
      }),
      { status: 400 }
    );
  }
  if (friendrequestalreadyexists) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "FRIEND_REQUEST_ALREADY_EXISTS",
      }),
      { status: 400 }
    );
  }
  const isalreadyfriended = user.friends.find(
    (friend) => friend.username === recieverusername
  );
  if (isalreadyfriended) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "ALREADY_FRIENDED",
      }),
      { status: 400 }
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
