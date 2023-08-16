import prisma from "@/lib/prisma";
import crypto from "crypto";

interface ReqBody {
  username: string;
  password: string;
}

export async function POST(req: Request) {
  const { username, password }: ReqBody = await req.json();
  if (!username || !password) {
    return new Response(JSON.stringify({ badRequest: true }), {
      status: 400,
    });
  }
  const hash = crypto
    .pbkdf2Sync(password, process.env.SALT || "testSalt", 100000, 64, "sha512")
    .toString("hex");
  await prisma.user.create({
    data: {
      username,
      password: hash,
    },
  });
  return new Response(JSON.stringify({ hash }));
}
