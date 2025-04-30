"use client";

import Link from "next/link";
import { useState } from "react";
import UserGreeting from "./UserGreeting";
import { categories } from "@/constants/categories";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="text-3xl text-center gap-3 justify-center flex mt-3 flex-col sm:flex-row sm:items-center sm:justify-between px-4">
      <div className="flex gap-3 justify-center items-center">
        <Link href="/">Home</Link>
        <p>|</p>

        <div className="relative">
          <button
            className="underline underline-offset-4"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            Categories
          </button>

          {isDropdownOpen && (
            <ul className="absolute bg-white shadow-lg border mt-2 p-2 text-base z-10">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/category/${cat}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p>|</p>
        <Link href="/exhibitions">Exhibitions</Link>
        <p>|</p>
        <Link href="/createUser">Create User</Link>
        <p>|</p>
        <Link href="/login">Login</Link>
      </div>

      <div className="ml-4">
        <UserGreeting />
      </div>
    </nav>
  );
}
