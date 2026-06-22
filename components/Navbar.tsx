import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth-server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  const user = sessionData?.user;
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-blue-600">
          <Stethoscope className="h-6 w-6" />
          <span>Medical Hub</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-700 hover:text-black">
                  Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                      <AvatarFallback className="bg-blue-600 text-white font-bold">
                        {firstLetter}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 bg-white rounded-md shadow-lg p-1" align="end">
                  <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="border-b border-gray-100" />
                  <DropdownMenuItem className="px-3 py-2 text-sm text-gray-500">
                    {user.email}
                  </DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-gray-700 hover:text-black">Log In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Start for free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}