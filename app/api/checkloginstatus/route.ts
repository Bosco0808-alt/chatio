import prisma from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { timingSafeEqual } from "crypto";

export async function GET() {
  const headerList = headers();
  const cookieList = cookies();
  const username = cookieList.get("username");
  const password = cookieList.get("password");
  const authkey = headerList.get("Authorization");
  if (!username || !password || !authkey) {
    return new Response(
      JSON.stringify({
        auth: false,
      }),
      { status: 401 }
    );
  }
  if (authkey !== process.env.NEXT_PUBLIC_AUTHKEY) {
    return new Response(
      JSON.stringify({
        auth: false,
      }),
      { status: 401 }
    );
  }
  const auth = await prisma.user.findUnique({
    where: {
      username: username.value,
    },
  });
  if (!auth) {
    return new Response(
      JSON.stringify({
        auth: false,
      }),
      { status: 401 }
    );
  }
  if (
    !timingSafeEqual(Buffer.from(auth.password), Buffer.from(password.value))
  ) {
    return new Response(
      JSON.stringify({
        auth: false,
      }),
      { status: 401 }
    );
  }
  return new Response(
    JSON.stringify({
      auth: true,
    })
  );
}
