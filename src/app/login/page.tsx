"use client";

import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl text-center mb-6">Login</h1>
      <LoginForm />
      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/createUser" className="text-blue-500 underline">
          Create User
        </Link>
      </p>
    </div>
  );
}
