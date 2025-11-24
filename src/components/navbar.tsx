"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { navItems } from "@/data";
import { Logo, MobileLogo } from "./logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";

import { UserButton } from "@clerk/nextjs";
import { useState } from "react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "./ui/theme-switcher-btn";

export const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
};

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[360px] sm:w-[540px]" side="left">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {navItems.map((item) => (
                <NavbarItem key={item.label} label={item.label} link={item.link} clickCallback={() => setIsOpen((prev) => !prev)} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-20 min-h-15 items-center gap-x-2">
          <MobileLogo />
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserButton />
        </div>
      </nav>
    </div>
  );
}

function DesktopNavbar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-20 min-h-15 items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {navItems.map((item) => (
              <NavbarItem key={item.label} label={item.label} link={item.link} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserButton />
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({ label, link, clickCallback }: { label: string; link: string; clickCallback?: () => void }) {
  const pathName = usePathname();
  const isActive = pathName === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start text-lg text-muted-foreground hover:text-foreground", isActive && "text-foreground")}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>

      {isActive && <div className="absolute -bottom-0.5 left-1/2 hidden h-0.5 w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block"></div>}
    </div>
  );
}
