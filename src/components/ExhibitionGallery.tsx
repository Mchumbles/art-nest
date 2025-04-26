"use client";

import { useEffect, useState } from "react";
import { Exhibition } from "@/types/exhibitions";
import Link from "next/link";

export default function ExhibitionGallery() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view your exhibitions.");
      setLoading(false);
      return;
    }

    const fetchExhibitions = async () => {
      try {
        const response = await fetch("/api/exhibitions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load exhibitions");
        } else {
          setExhibitions(data.exhibitions || data);
        }
      } catch (error) {
        setError("Failed to fetch exhibitions");
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  if (loading) {
    return <p>Loading exhibitions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {exhibitions.length === 0 ? (
        <p className="text-center">You have no exhibitions yet.</p>
      ) : (
        exhibitions.map((exhibition) => (
          <Link key={exhibition.id} href={`/exhibitions/${exhibition.id}`}>
            <div className="border p-4 rounded-lg shadow-md hover:bg-gray-100 transition cursor-pointer">
              <h3 className="text-xl font-semibold">{exhibition.title}</h3>
              <p className="text-sm text-gray-600">{exhibition.location}</p>
              <p className="text-sm text-gray-500">{exhibition.category}</p>
              <p className="text-sm text-gray-400">
                {new Date(exhibition.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
