import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import {
  cardStatementsSchema,
  invoicesSchema,
  receiptsSchema,
} from "@/lib/llm/schema";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text, category } = await req.json();

  if (!category || !text) {
    return NextResponse.json(
      { error: "No category nor text provided" },
      { status: 400 }
    );
  }

  let schema = {};

  switch (category) {
    case "receipts":
      schema = receiptsSchema;
      break;
    case "invoices":
      schema = invoicesSchema;
      break;
    case "credit card statements": {
      schema = cardStatementsSchema;
      break;
    }
    default:
      return NextResponse.json(
        { error: "Invalid category provided" },
        { status: 400 }
      );
  }

  let res = await fetch("http://localhost:3000/v1/organized-data/json/schema", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.X_API_KEY as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: {
        apiKey: process.env.OPENAI_API_KEY as string,
        name: "gpt-3.5-turbo",
      },
      jsonSchema: JSON.stringify(schema),
      text,
    }),
  });

  if (res.status === 422) {
    res = await fetch("http://localhost:3000/v1/organized-data/json/schema", {
      method: "POST",
      headers: {
        "X-API-Key": process.env.X_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: {
          apiKey: process.env.OPENAI_API_KEY as string,
          name: "gpt-3.5-turbo",
        },
        jsonSchema: JSON.stringify(schema),
        text,
        refine: true,
      }),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: res.statusText },
        { status: res.status }
      );
    }
  } else if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }

  const { output } = await res.json();

  return NextResponse.json(output, { status: 201 });
}
