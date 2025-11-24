import Link from "next/link";
import { FaGoogleWallet } from "react-icons/fa6";

export const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <FaGoogleWallet className="stroke h-11 w-11 stroke-amber-500 stoke-[1.5]" />
      <p className="bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">Expense Tracker</p>
    </Link>
  );
};

export const MobileLogo = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <FaGoogleWallet className="stroke h-11 w-11 stroke-amber-500 stoke-[1.5]" />
    </Link>
  );
};
