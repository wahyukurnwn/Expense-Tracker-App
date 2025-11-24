"use server";

import { prisma } from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const query = OverviewQuerySchema.safeParse({ from, to });

  if (!query.success) {
    return Response.json(query.error.message, {
      status: 400,
    });
  }

  const stats = await getBalanceStatsAction(user.id, query.data.from, query.data.to);

  return Response.json(stats);
}

export type GetBalanceStatsResponseTye = Awaited<ReturnType<typeof getBalanceStatsAction>>;

async function getBalanceStatsAction(userId: string, from: Date, to: Date) {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((item) => item.type === "expense")?._sum.amount || 0,
    income: totals.find((item) => item.type === "income")?._sum.amount || 0,
  };
}
