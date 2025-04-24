"use client";

import CreateUserForm from "@/components/CreateUserForm";

export default function CreateUserPage() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-6 text-center">Create User</h1>
      <CreateUserForm />
    </div>
  );
}
