"use client";

import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="p-8 max-w-md mx-auto" role="main">
      <h1 className="text-2xl text-center mb-6" id="login-title">
        Login
      </h1>

      <section aria-labelledby="login-title">
        <LoginForm />
      </section>

      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link
          href="/createUser"
          className="text-blue-500 underline"
          aria-label="Go to Create User page"
        >
          Create User
        </Link>
      </p>
    </div>
  );
}
