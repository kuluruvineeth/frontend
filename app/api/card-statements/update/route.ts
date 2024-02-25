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
    await prisma.cardStatement.updateMany({
      where: {
        id: jsonObj.id,
        userId: userUUID,
      },
      data: {
        creditCardName: jsonObj.creditCardName,
        creditCardHolder: jsonObj.creditCardHolder,
        creditCardNumber: jsonObj.creditCardNumber,
        issuerName: jsonObj.issuerName,
        issuerAddress: jsonObj.issuerAddress,
        recipientName: jsonObj.recipientName,
        recipientAddress: jsonObj.recipientAddress,
        date: new Date(jsonObj.date).toISOString(),
        currency: jsonObj.currency,
        totalAmountDue: parseFloat(jsonObj.totalAmountDue),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "cardStatement not created, bad data" },
      { status: 400 }
    );
  }
  try {
    await prisma.cardTransaction.deleteMany({
      where: {
        cardStatementId: jsonObj.id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not delete cardStatement items" },
      { status: 400 }
    );
  }

  try {
    await prisma.cardTransaction.createMany({
      data: jsonObj.transactions?.map((item: any) => ({
        cardStatementId: jsonObj.id,
        description: item.description,
        category: item.category,
        amount: parseFloat(item.amount),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not create cardStatement items" },
      { status: 400 }
    );
  }

  return NextResponse.json("cardStatement updated", { status: 200 });
}
