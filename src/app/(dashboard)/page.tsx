"use server";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateTransactionDialog } from "./_components/create-transaction-dialog";
import { Overview } from "./_components/overview";
import { History } from "./_components/history";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) redirect("/wizard");

  return (
    <div className="h-full bg-background">
      <div className="border-b">
        <div className="container flex flex-wrap items-center justify-between gap-6 p-8">
          <p className="text-3xl font-bold">Hello, {user.firstName}!👋</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button variant={"ghost"} className="border-emerald-300 bg-emerald-800 text-white hover:bg-emerald-700 dark:hover:bg-emerald-400 hover:text-white">
                  New income 😍
                </Button>
              }
              type="income"
            />

            <CreateTransactionDialog
              trigger={
                <Button variant={"ghost"} className="border-rose-300 bg-rose-800 text-white hover:bg-rose-700 dark:hover:bg-rose-400 hover:text-white">
                  New expense 😵
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>

      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
}
