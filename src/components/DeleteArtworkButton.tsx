"use client";

import { useRouter } from "next/navigation";
import { DeleteButtonProps } from "@/types/userArtworks";

export default function DeleteButton({ id, exhibitionId }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
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
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600">
      Delete Artwork
    </button>
  );
}
