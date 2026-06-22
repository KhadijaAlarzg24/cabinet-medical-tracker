"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { signUp } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router =useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
     const result = await signUp.email({
  name,
  email,
  password,
});

      //console.log("Account created");
      if(result.error){
        setError(result.error.message ?? "Failed to sign up");
      }else{
        router.push("/dashboard");

      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create an account to start tracking
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
            {
              error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                  
                  </div>
              )
            }

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Name</Label>

              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="nom@prenom.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>

            <p className="text-center text-sl text-gray-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-blue-500 underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}