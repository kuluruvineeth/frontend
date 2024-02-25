import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  const res = await fetch(
    `http://localhost:3000/v1/organized-data/json/classification`,
    {
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
        categories: ["receipts", "credit card statements", "invoices"],
        text,
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }
  const { classification } = await res.json();

  return NextResponse.json(classification, { status: 200 });
}
