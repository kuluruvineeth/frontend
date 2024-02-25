import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "./prisma";
import { Status } from "@prisma/client";
import { headers } from "next/headers";

export async function getS3ObjectUrl(uuid: string) {
  const res = await fetch(`http://localhost:3001/api/signed-url?uuid=${uuid}`, {
    method: "GET",
    headers: {
      Cookie: headers().get("cookie") || "",
    },
  });

  // if (!res.ok) {
  //   throw new Error("Failed to fetch data");
  // }

  return res.json();
}

export async function getText(url: string) {
  const res = await fetch("http://localhost:3000/v1/parsers/pdf/url", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.X_API_KEY as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (res.status === 422) {
    return "";
  }

  // if (!res.ok) {
  //   throw new Error("Failed to do text recognition");
  // }

  const { content } = await res.json();
  return content;
}

export async function getExtractionData(uuid: string, status: Status) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Cannot authenticate user");
  }

  const userUUID = session.user.id;
  const extractionData = await prisma.extraction.findFirst({
    where: {
      id: uuid,
      userId: userUUID,
      status,
    },
  });

  if (!extractionData) {
    throw new Error("Failed to fetch data");
  }

  return {
    filename: extractionData.filename,
    text: extractionData.text as string,
    category: extractionData.category,
    json: extractionData.json,
  };
}

export async function getExtractions(status: Status) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Cannot authenticate user");
  }

  const userUUID = session.user.id;
  const extractions = await prisma.extraction.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      user: {
        id: userUUID,
      },
      status: status,
    },
  });

  return extractions;
}

export async function getReceipts() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Cannot authenticate user");
  }

  const userUUID = session.user.id;
  const receipts = await prisma.receipt.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      user: {
        id: userUUID,
      },
    },
    include: {
      extraction: true,
    },
  });

  if (receipts.length === 0) {
    return null;
  }

  const avgMonthlyExpenses: any = await prisma.$queryRaw`
    WITH months AS (SELECT generate_series(1,12) As month), receipts AS (SELECT COALESCE(EXTRACT(MONTH FROM date),0) AS month, AVG(total) AS average
    FROM "Receipt"
    WHERE "userId" = ${userUUID}
    GROUP BY
      EXTRACT(MONTH FROM date))
    SELECT months.month,
    COALESCE(receipts.average,0) AS average
    FROM 
      months
    LEFT JOIN
      receipts ON months.month = receipts.month
    -- UNION ALL
    -- SELECT 
    --   0 as month,
    --   AVG(total) AS average
    -- FROM
    --   "Receipt"
    -- WHERE
    --   date is NULL AND
    --   "userId" = ${userUUID}
    ORDER BY
      month`;

  const categoryCounts = await prisma.receipt.groupBy({
    by: ["category"],
    where: {
      id: userUUID,
    },
    _count: {
      category: true,
    },
  });

  const categoryDistribution = categoryCounts.map((item) => ({
    category: item.category,
    percentage:
      receipts.length === 0
        ? 0
        : (item._count.category / receipts.length) * 100,
  }));

  const highestTotalAmount = await prisma.receipt.aggregate({
    where: {
      userId: userUUID,
    },
    _max: {
      total: true,
    },
  });

  const mostExpensiveCategory = await prisma.receipt.groupBy({
    by: ["category"],
    where: {
      userId: userUUID,
    },
    _sum: {
      total: true,
    },
    orderBy: {
      _sum: {
        total: "desc",
      },
    },
    take: 1,
  });

  const mostRecurrentFrom = await prisma.receipt.groupBy({
    by: ["from"],
    _count: {
      from: true,
    },
    where: {
      userId: userUUID,
    },
    orderBy: {
      _count: {
        from: "desc",
      },
    },
    take: 1,
  });

  const response = {
    receipts,
    avgMonthlyExpenses,
    categoryDistribution,
    highestTotalAmount: {
      total: highestTotalAmount._max.total,
    },
    mostExpensiveCategory: {
      category: mostExpensiveCategory[0].category,
      total: mostExpensiveCategory[0]._sum.total,
    },
    mostRecurrentFrom: {
      from: mostRecurrentFrom[0].from,
      count: mostRecurrentFrom[0]._count.from,
    },
  };

  return response;
}

export async function getInvoicesData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Cannot authenticate user");
  }

  const userUUID = session.user.id;
  const invoices = await prisma.invoice.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      user: {
        id: userUUID,
      },
    },
    include: {
      extraction: true,
    },
  });

  if (invoices.length === 0) {
    return null;
  }

  // const avgMonthlyExpenses: any = await prisma.$queryRaw`
  //   WITH months AS (SELECT generate_series(1,12) As month), invoices AS (SELECT COALESCE(EXTRACT(MONTH FROM date),0) AS month, AVG(total) AS average
  //   FROM "Invoice"
  //   WHERE "userId" = ${userUUID}
  //   GROUP BY
  //     EXTRACT(MONTH FROM date))
  //   SELECT months.month,
  //   COALESCE(receipts.average,0) AS average
  //   FROM
  //     months
  //   LEFT JOIN
  //     invoices ON months.month = receipts.month
  //   ORDER BY
  //     month`;

  const categoryCounts = await prisma.invoice.groupBy({
    by: ["category"],
    where: {
      id: userUUID,
    },
    _count: {
      category: true,
    },
  });

  const categoryDistribution = categoryCounts.map((item) => ({
    category: item.category,
    percentage:
      invoices.length === 0
        ? 0
        : (item._count.category / invoices.length) * 100,
  }));

  const highestTotalAmount = await prisma.invoice.aggregate({
    where: {
      userId: userUUID,
    },
    _max: {
      totalAmountDue: true,
    },
  });

  const mostExpensiveCategory = await prisma.invoice.groupBy({
    by: ["category"],
    where: {
      userId: userUUID,
    },
    _sum: {
      totalAmountDue: true,
    },
    orderBy: {
      _sum: {
        totalAmountDue: "desc",
      },
    },
    take: 1,
  });

  const mostRecurrentIssuer = await prisma.invoice.groupBy({
    by: ["fromName"],
    _count: {
      fromName: true,
    },
    where: {
      userId: userUUID,
    },
    orderBy: [
      {
        _count: {
          fromName: "desc",
        },
      },
      { fromName: "asc" },
    ],
    take: 1,
  });

  const response = {
    invoices,
    avgMonthlyExpenses: [],
    categoryDistribution,
    highestTotalAmount: {
      total: highestTotalAmount._max.totalAmountDue,
    },
    mostExpensiveCategory: {
      category: mostExpensiveCategory[0].category,
      total: mostExpensiveCategory[0]._sum.totalAmountDue,
    },
    mostRecurrentIssuer: {
      fromName: mostRecurrentIssuer[0].fromName,
      count: mostRecurrentIssuer[0]._count.fromName,
    },
  };

  return response;
}

export async function getCardStatementsData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Cannot authenticate user");
  }

  const userUUID = session.user.id;
  const cardStatements = await prisma.cardStatement.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      user: {
        id: userUUID,
      },
    },
    include: {
      extraction: true,
    },
  });

  if (cardStatements.length === 0) {
    return null;
  }

  // const avgMonthlyExpenses: { month: number; average: number }[] =
  //   await prisma.$queryRaw`
  //   WITH months AS (SELECT generate_series(1,12) As month), cardStatements AS (SELECT COALESCE(EXTRACT(MONTH FROM date),0) AS month, AVG(totalAmountDue) AS average
  //   FROM "CardStatement"
  //   WHERE "userId" = ${userUUID}
  //   GROUP BY
  //     EXTRACT(MONTH FROM date))
  //   SELECT months.month,
  //   COALESCE(cardStatements.average,0) AS average
  //   FROM
  //     months
  //   LEFT JOIN
  //     cardStatements ON months.month = cardStatements.month
  //   ORDER BY
  //     month`;

  const categoryDistribution: {
    category: string;
    count: number;
    percentage: number;
  }[] = await prisma.$queryRaw`
    SELECT 
      t.category,
      COUNT(t.category) as count,
      COUNT(t.category) * 100.0 / (
        SELECT COUNT(*)
        FROM "CardTransaction" as t
        JOIN "CardStatement" as s ON t."cardStatementId" = s.id
        WHERE s."userId" = ${userUUID}
      ) as percentage
      FROM "CardTransaction" as t
      JOIN "CardStatement" as s ON t."cardStatementId" = s.id
      WHERE s."userId" = ${userUUID}
      GROUP BY t.category`;

  const highestTotalAmount = await prisma.cardStatement.aggregate({
    where: {
      userId: userUUID,
    },
    _max: {
      totalAmountDue: true,
    },
  });

  const mostExpensiveCategory: { category: string; totalAmount: number }[] =
    await prisma.$queryRaw`
  SELECT 
    t.category,
    SUM(t.amount) as totalAmount
    FROM "CardTransaction" as t
    JOIN "CardStatement" as s ON t."cardStatementId" = s.id
    WHERE s."userId" = ${userUUID}
    GROUP BY t.category
    ORDER BY totalAmount DESC
    LIMIT 1`;

  const mostRecurrentTransaction: { description: string; count: number }[] =
    await prisma.$queryRaw`
  SELECT 
    t.description,
    COUNT(t.description) as count
    FROM "CardTransaction" as t
    JOIN "CardStatement" as s ON t."cardStatementId" = s.id
    WHERE s."userId" = ${userUUID}
    GROUP BY t.description
    ORDER BY count DESC
    LIMIT 1`;

  const response = {
    cardStatements,
    avgMonthlyExpenses: [],
    categoryDistribution: categoryDistribution.map((item) => ({
      category: item.category,
      percentage: parseFloat(item.percentage.toFixed(2)),
    })),
    highestTotalAmount: {
      total: highestTotalAmount._max.totalAmountDue,
    },
    mostExpensiveCategory: {
      category: mostExpensiveCategory[0].category,
      total: mostExpensiveCategory[0].totalAmount,
    },
    mostRecurrentTransaction: {
      from: mostRecurrentTransaction[0].description,
      count: mostRecurrentTransaction[0].count,
    },
  };

  return response;
}

export async function getUserPreferences() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Cannot authenticate user");
  }

  const userUUID = session.user.id;

  const preferences = await prisma.preferences.findFirst({
    where: {
      userId: userUUID,
    },
  });

  if (!preferences) {
    throw new Error("Failed to fetch data");
  }

  return preferences;
}
