"use server";

import { prisma } from "@/lib/prisma";
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function createCategoryAction(form: CreateCategorySchemaType) {
  const user = await currentUser();
  if (!user) redirect("sign-in");
  const parsedBody = CreateCategorySchema.safeParse(form);

  if (!parsedBody.success) throw new Error("bad request");

  const { name, icon, type } = parsedBody.data;
  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}
