"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  const user = await currentUser();

  if (!user) redirect("sign-in");

  const searchParams = request.nextUrl.searchParams;
  const paramsType = searchParams.get("type");

  const validator = z.enum(["expense", "income"]).nullable();
  const queryParams = validator.safeParse(paramsType);

  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // include type the filters if it's defined
    },
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(categories);
}
