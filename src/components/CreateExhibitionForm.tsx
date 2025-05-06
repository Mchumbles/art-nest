"use client";

import { useState } from "react";
import Loading from "@/components/Loading";

export default function CreateExhibitionForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must be logged in to create an exhibition.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/exhibitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, category }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        console.log("Error from API:", data.error || "Something went wrong");
      } else {
        setMessage("Exhibition created successfully!");
        setTitle("");
        setCategory("");
      }
    } catch (error) {
      setMessage("Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl mb-4 text-center">Create Exhibition</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <div className="w-full">
          <label htmlFor="title" className="sr-only">
            Exhibition Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 p-2 w-full"
            required
            aria-required="true"
          />
        </div>

        <div className="w-full">
          <label htmlFor="category" className="sr-only">
            Exhibition Category
          </label>
          <input
            id="category"
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-2 p-2 w-full"
            required
            aria-required="true"
          />
        </div>

        <button
          type="submit"
          className="border-2 py-2"
          disabled={loading}
          aria-label="Submit the form to create an exhibition"
        >
          {loading ? "Creating..." : "Create Exhibition"}
        </button>

        {message && (
          <p className="text-sm text-center mt-2" aria-live="polite">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
