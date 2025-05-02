"use client";

import { useRouter } from "next/navigation";
import { DeleteExhibitionButtonProps } from "@/types/exhibitions";
import Loading from "@/components/Loading";
import { useState } from "react";

export default function DeleteExhibitionButton({
  id,
}: DeleteExhibitionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
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
      className="text-red-600 hover:underline"
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete Exhibition"}
    </button>
  );
}
