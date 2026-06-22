import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function signOut() {
  const result = await auth.api.signOut({
    headers: await headers(),
  });
  if (result.success) {
    redirect("/sign-in");
  }
}