"use client";

import CreateUserForm from "@/components/CreateUserForm";

export default function CreateUserPage() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-6 text-center" id="create-user-heading">
        Create User
      </h1>
      <p id="create-user-form-description" className="sr-only">
        Fill out the form to create a new user account.
      </p>
      <CreateUserForm />
    </div>
  );
}
