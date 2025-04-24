import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="text-3xl text-center gap-3 justify-center flex mt-3">
      <Link href="/">Home</Link>
      <p>|</p>
      <Link href="/paintings">Paintings</Link>
      <p>|</p>
      <Link href="/createUser">Create User</Link>
      <p>|</p>
      <Link href="/login">Login</Link>
    </nav>
  );
}
