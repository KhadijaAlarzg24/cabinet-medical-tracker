"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Link from "next/link"; 

export default function SignIn() {
  return (
   
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in Page</CardTitle>
          <CardDescription>Enter your credentials to access your accunt</CardDescription>
        </CardHeader>

        <form>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Nom@prenom.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                minLength={8} 
                className="border-gray-300 focus:border-primary focus:ring-primary" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">Sign in</Button>
            <p className="text-sm text-gray-500">
              Don't have an account? <Link href="/login" className="text-primary underline">Sgin Up</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}