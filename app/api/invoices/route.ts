import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const receiptUUID = searchParams.get("uuid");
  const userUUID = session.user.id;

  if (!receiptUUID) {
    return NextResponse.json({ error: "No UUID provided" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: receiptUUID, userId: userUUID },
    include: { items: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json(invoice, { status: 200 });
}
