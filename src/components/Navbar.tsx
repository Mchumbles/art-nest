"use client";

import Link from "next/link";
import UserGreeting from "./UserGreeting";

export default function Navbar() {
  return (
    <nav className="text-3xl text-center gap-3 justify-center flex mt-3 flex-col sm:flex-row sm:items-center sm:justify-between px-4">
      <div className="flex gap-3 justify-center">
        <Link href="/">Home</Link>
        <p>|</p>
        <Link href="/paintings">Paintings</Link>
        <p>|</p>
        <Link href="/createUser">Create User</Link>
        <p>|</p>
        <Link href="/login">Login</Link>
      </div>
      <div className="ml-4">
        <UserGreeting />
      </div>{" "}
    </nav>
  );
}
