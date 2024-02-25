import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Status } from "@prisma/client";
import {
  cardStatementsSchema,
  invoicesSchema,
  receiptsSchema,
} from "@/lib/llm/schema";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userUUID = session?.user.id;

  const { uuid, json, category } = await req.json();

  if (!uuid || !json || !category) {
    return NextResponse.json(
      { error: "No UUID nor json or category provided" },
      { status: 400 }
    );
  }

  switch (category) {
    case "receipts":
      break;
    case "invoices":
      break;
    case "credit card statements":
      break;
    default:
      return NextResponse.json(
        {
          error: "Invalid category provided",
        },
        {
          status: 400,
        }
      );
  }

  const updatedExtraction = await prisma.extraction.updateMany({
    where: {
      id: uuid,
      userId: userUUID,
      status: Status.TO_EXTRACT,
    },
    data: {
      json,
      category,
      status: Status.TO_VERIFY,
    },
  });

  if (!updatedExtraction.count) {
    return NextResponse.json(
      {
        error: "Extraction not found or not updated",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({ mesage: "Extraction updated" }, { status: 201 });
}
