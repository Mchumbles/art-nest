"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteButtonProps } from "@/types/userArtworks";
import Loading from "@/components/Loading";

export default function DeleteButton({ id, exhibitionId }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/userArtworks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete artwork");
      }

      router.push(`/exhibitions/${exhibitionId}`);
    } catch (error) {
      console.error("Error deleting artwork:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600"
      disabled={loading}
      aria-label="Delete Artwork"
      title="Delete this artwork from the exhibition"
    >
      {loading ? "Deleting..." : "Delete Artwork"}
    </button>
  );
}
