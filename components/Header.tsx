import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { signOut } from "@/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getInitials } from "@/lib/utils";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { Session } from "next-auth";

const Header = async ({ session }: { session: Session }) => {
  const isAdmin = !!session?.user?.id &&
    (await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
    )?.[0]?.role === "Admin";

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" width={40} height={40} alt="logo" />
      </Link>

      <ul className="flex flex-row items-center gap-3">

        <li>
          <Link href="/my-profile">
            <Avatar>
              <AvatarFallback>
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
          </Link>
        </li>

        {isAdmin && (
          <li>
            <Link href="/admin">
              <Button className="cursor-pointer">Admin</Button>
            </Link>
          </li>
        )}

        <li>
          <form
            className=""
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button className="cursor-pointer">Logout</Button>
          </form>
        </li>
      </ul>
    </header>
  );
};

export default Header;
