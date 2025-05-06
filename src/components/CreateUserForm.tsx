"use client";

import { useState } from "react";
import Loading from "@/components/Loading";

export default function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("User created successfully");
        setEmail("");
        setUsername("");
        setPassword("");
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setMessage("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      aria-labelledby="create-user-form"
    >
      <h2 id="create-user-form" className="sr-only">
        Create User Account Form
      </h2>
      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm font-medium mb-1">
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
          aria-required="true"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="username" className="text-sm font-medium mb-1">
          Username
        </label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="px-4 py-2 border-2"
          aria-required="true"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="text-sm font-medium mb-1">
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
          aria-required="true"
        />
      </div>
      <button
        type="submit"
        className="border-2 py-2"
        disabled={loading}
        aria-label="Create user account"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
      {message && (
        <p className="mt-4 text-center text-sm" role="alert" aria-live="polite">
          {message}
        </p>
      )}
    </form>
  );
}
