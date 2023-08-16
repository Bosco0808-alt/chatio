import { cookies } from "next/headers";

interface ReqBody {
  username: string;
  hash: string;
}

export async function POST(req: Request) {
  const { username, hash }: ReqBody = await req.json();
  if (!username || !hash) {
    return new Response(JSON.stringify({ badRequest: true }), {
      status: 400,
    });
  }
  cookies().set("username", username, {
    path: "/",
    expires: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  });
  cookies().set("hash", hash, {
    path: "/",
    expires: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  });
  return new Response(JSON.stringify({ badRequest: false }));
}
