"use client";

import { useState } from "react";

export default function CreateExhibitionForm() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must be logged in to create an exhibition.");
      return;
    }

    try {
      const res = await fetch("/api/exhibitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, location, category }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        console.log("Error from API:", data.error || "Something went wrong");
      } else {
        setMessage("Exhibition created successfully!");
        setTitle("");
        setLocation("");
        setCategory("");
      }
    } catch (error) {
      setMessage("Error connecting to the server");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl mb-4 text-center">Create Exhibition</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-2 p-2"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border-2 p-2"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-2 p-2"
          required
        />
        <button type="submit" className="border-2 py-2">
          Create Exhibition
        </button>
        {message && <p className="text-sm text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
