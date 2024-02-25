import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userUUID = session.user.id;

  const jsonObj = await req.json();

  if (!jsonObj) {
    return NextResponse.json({ error: "No JSON provided" }, { status: 400 });
  }

  try {
    await prisma.invoice.updateMany({
      where: {
        id: jsonObj.id,
        userId: userUUID,
      },
      data: {
        invoiceNumber: jsonObj.invoiceNumber,
        category: jsonObj.category,
        date: new Date(jsonObj.date).toISOString(),
        fromName: jsonObj.fromName,
        fromAddress: jsonObj.fromAddress,
        toName: jsonObj.toName,
        toAddress: jsonObj.toAddress,
        currency: jsonObj.currency,
        totalAmountDue: parseFloat(jsonObj.totalAmountDue),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Receipt not created, bad data" },
      { status: 400 }
    );
  }
  try {
    await prisma.invoiceItem.deleteMany({
      where: {
        invoiceId: jsonObj.id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not delete receipt items" },
      { status: 400 }
    );
  }

  try {
    await prisma.invoiceItem.createMany({
      data: jsonObj.items?.map((item: any) => ({
        invoiceId: jsonObj.id,
        description: item.description,
        amount: parseFloat(item.amount),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not create receipt items" },
      { status: 400 }
    );
  }

  return NextResponse.json("invoice updated", { status: 200 });
}
