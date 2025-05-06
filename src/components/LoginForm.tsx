"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        setMessage("Login successful!");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      autoComplete="off"
      aria-labelledby="login-form"
    >
      <h2 id="login-form" className="sr-only">
        Login Form
      </h2>

      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <input
        type="email"
        id="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="px-4 py-2 border-2"
        autoComplete="off"
        aria-describedby="email-helper"
      />
      <span id="email-helper" className="sr-only">
        Enter your email address
      </span>

      <label htmlFor="password" className="sr-only">
        Password
      </label>
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="px-4 py-2 border-2"
        autoComplete="new-password"
        aria-describedby="password-helper"
      />
      <span id="password-helper" className="sr-only">
        Enter your password
      </span>

      <button
        type="submit"
        className="border-2 py-2"
        disabled={loading}
        aria-live="polite"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-red-500" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
