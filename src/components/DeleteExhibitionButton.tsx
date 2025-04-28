"use client";

import { useRouter } from "next/navigation";

interface DeleteExhibitionButtonProps {
  id: string;
}

export default function DeleteExhibitionButton({
  id,
}: DeleteExhibitionButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/exhibitions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete exhibition");
      }

      router.push("/exhibitions");
    } catch (error) {
      console.error("Error deleting exhibition:", error);
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:underline">
      Delete Exhibition
    </button>
  );
}
