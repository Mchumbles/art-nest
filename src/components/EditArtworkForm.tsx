"use client";

import { useState, useEffect } from "react";

interface EditArtworkFormProps {
  artworkId: string;
}

export default function EditArtworkForm({ artworkId }: EditArtworkFormProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchArtwork() {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You must be logged in to edit artwork.");
        return;
      }

      try {
        const res = await fetch(`/api/userArtworks/${artworkId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.error || "Something went wrong");
        } else {
          setTitle(data.title);
          setArtist(data.artist);
          setImage(data.image);
          setDate(data.date ? data.date.slice(0, 10) : "");
        }
      } catch (error) {
        setMessage("Error connecting to the server");
      }
    }

    fetchArtwork();
  }, [artworkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must be logged in to update artwork.");
      return;
    }

    try {
      const parsedDate = date ? date : null;

      const res = await fetch(`/api/userArtworks/${artworkId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, artist, image, date: parsedDate }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage("Artwork updated successfully!");
      }
    } catch (error) {
      setMessage("Error connecting to the server");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl mb-4 text-center">Edit Artwork</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-2 p-2"
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="border-2 p-2"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border-2 p-2"
        />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-2 p-2"
        />
        <button type="submit" className="border-2 py-2">
          Update Artwork
        </button>
        {message && <p className="text-sm text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
