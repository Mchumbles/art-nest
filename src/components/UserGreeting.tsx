"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserGreeting() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("username");
    setUsername(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <div className="text-sm mt-1 text-center">
      {username ? (
        <>
          <p>Welcome, {username}</p>
          <button
            onClick={handleLogout}
            className="text-xs text-blue-500 mt-1"
            aria-label="Log out"
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <p>Not logged in</p>
          <div className="mt-1 space-x-2">
            <Link
              href="/login"
              className="text-blue-500 underline text-xs"
              aria-label="Login page"
            >
              Login
            </Link>
            <span>|</span>
            <Link
              href="/createUser"
              className="text-blue-500 underline text-xs"
              aria-label="Register page"
            >
              Register
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
