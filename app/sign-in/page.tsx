"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; 

export default function SignIn() {
  const router = useRouter();
  
  // State variables for inputs, loading, and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form submission handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Connect to Better-Auth and authenticate
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result?.error) {
        // Display error if sign-in fails
        setError(result.error.message || "Sign in failed. Please check your credentials.");
      } else {
        // Redirect to dashboard upon success
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access the clinic dashboard</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Display error message if it exists */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                minLength={8} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 focus:border-primary focus:ring-primary" 
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {/* Submit button changes text during loading */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            
            <p className="text-sm text-gray-500 text-center">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-primary underline font-medium">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}