"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";

export default function LogoutButton() {
  return (
    <DropdownMenuItem onClick={() => signOut()}>
      Log Out
    </DropdownMenuItem>
  );
}