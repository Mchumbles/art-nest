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
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="px-4 py-2 border-2"
        autoComplete="off"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="px-4 py-2 border-2"
        autoComplete="new-password"
      />
      <button type="submit" className="border-2 py-2" disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </button>
      {message && (
        <p className="mt-4 text-center text-sm text-red-500">{message}</p>
      )}
    </form>
  );
}
