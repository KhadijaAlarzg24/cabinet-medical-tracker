"use client"; // ضروري لأنك تستخدم فورم ومكونات تفاعلية

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // تأكد من استيراده من next/link وليس lucide-react

// لاحظ التغيير هنا: بدأت الحرف بـ S كبير
export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>enter an account to start tracking</CardDescription>
        </CardHeader>
        <form>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Enter your name" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Nom@prenom.com" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={8} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full">Sign Up</Button>
            <p className="text-sm">
              Already have an account? <Link href="/sign-in" className="text-blue-500 underline">Sign In</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}