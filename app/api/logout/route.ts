import { cookies, headers } from "next/headers";

export async function GET(req: Request) {
  const cookie = cookies();
  if (headers().get("Authorization") !== process.env.NEXT_PUBLIC_AUTHKEY) {
    return new Response(
      JSON.stringify({
        error: true,
      }),
      { status: 401 }
    );
  }
  cookie.delete("username");
  cookie.delete("password");
  return new Response(
    JSON.stringify({
      error: false,
    })
  );
}
