"use client";

import { useEffect, useState } from "react";

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
          <button onClick={handleLogout} className="text-xs text-blue-500 mt-1">
            Log out
          </button>
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
