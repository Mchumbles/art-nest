"use client";

import { useState } from "react";

export default function CreateExhibitionForm() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form Submitted");
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (!token) {
      setMessage("You must be logged in to create an exhibition.");
      console.log("No token found, user is not logged in");
      return;
    }

    try {
      console.log("Sending request to /api/postExhibitions");
      const res = await fetch("/api/postExhibitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, location, category }),
      });

      console.log("Response Status:", res.status);

      const data = await res.json();
      console.log("Response Data:", data);

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        console.log("Error from API:", data.error || "Something went wrong");
      } else {
        setMessage("Exhibition created successfully!");
        setTitle("");
        setLocation("");
        setCategory("");
        console.log("Exhibition created successfully");
      }
    } catch (error) {
      console.error("Error connecting to the server:", error);
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
