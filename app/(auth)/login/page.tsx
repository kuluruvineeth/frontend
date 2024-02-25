import Image from "next/image";

import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col text-center">
          <Image
            className="mx-auto"
            src="/logo.png"
            width={302}
            height={57}
            alt="Organize Simple Logo"
          />
          <h1 className="text-2xl mt-8 font-semibold tracking-tight">
            Welcome back
          </h1>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
