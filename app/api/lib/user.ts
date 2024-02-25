import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function getUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
