"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import UserGreeting from "./UserGreeting";
import { categories } from "@/constants/categories";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpenMobile, setIsCategoriesOpenMobile] = useState(false);
  const [isDropdownOpenDesktop, setIsDropdownOpenDesktop] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpenDesktop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [desktopDropdownRef]);

  return (
    <nav className="bg-white shadow-md py-4 px-4 relative z-30">
      <div className="container mx-auto flex items-center justify-between text-xl sm:text-2xl">
        <Link href="/" className="font-semibold">
          Art Nest
        </Link>

        <div className="sm:hidden">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            {isMobileMenuOpen ? (
              <IoClose size={24} />
            ) : (
              <GiHamburgerMenu size={24} />
            )}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-8 lg:gap-20 ml-20 lg:ml-50 mr-10">
          {" "}
          <div className="relative" ref={desktopDropdownRef}>
            <button
              className="hover:text-blue-600 focus:outline-none"
              onClick={() => setIsDropdownOpenDesktop((prev) => !prev)}
            >
              Categories
            </button>

            {isDropdownOpenDesktop && (
              <ul className="absolute left-0 bg-white shadow-lg border mt-2 p-2 text-base z-10">
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={`/category/${cat}`}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600"
                      onClick={() => setIsDropdownOpenDesktop(false)}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link href="/exhibitions" className="hover:text-blue-600">
            Exhibitions
          </Link>
          <Link href="/login" className="hover:text-blue-600">
            Login
          </Link>
        </div>

        <div className="hidden sm:block ml-auto">
          <UserGreeting />
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b z-20 mt-1 overflow-hidden sm:hidden">
            <div className="flex flex-col p-4 gap-3">
              <div className="relative">
                <button
                  className="block py-2 w-full text-left hover:bg-gray-100 hover:text-blue-600 focus:outline-none"
                  onClick={() => setIsCategoriesOpenMobile((prev) => !prev)}
                >
                  Categories
                </button>

                {isCategoriesOpenMobile && (
                  <ul className="ml-4 border-l">
                    {categories.map((cat) => (
                      <li key={cat}>
                        <Link
                          href={`/category/${cat}`}
                          className="block py-2 hover:bg-gray-100 hover:text-blue-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Link
                href="/exhibitions"
                className="block py-2 hover:bg-gray-100 hover:text-blue-600"
              >
                Exhibitions
              </Link>
              <Link
                href="/login"
                className="block py-2 hover:bg-gray-100 hover:text-blue-600"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
