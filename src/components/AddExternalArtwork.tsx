"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArtObject } from "@/types/artworks";
import { Exhibition } from "@prisma/client";
import Loading from "@/components/Loading";

interface AddToExhibitionProps {
  artwork: ArtObject;
}

const AddToExhibition: React.FC<AddToExhibitionProps> = ({ artwork }) => {
  const [userExhibitions, setUserExhibitions] = useState<Exhibition[] | null>(
    null
  );
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [addingArtwork, setAddingArtwork] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchUserExhibitions = async () => {
      if (token) {
        try {
          const response = await fetch("/api/exhibitions", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserExhibitions(data);
          } else {
            console.error("Failed to fetch user exhibitions");
            setMessage("Failed to load your exhibitions.");
          }
        } catch (error) {
          console.error("Error fetching user exhibitions:", error);
          setMessage("Error loading your exhibitions.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserExhibitions();
  }, [token]);

  const handleAddToExhibition = async () => {
    if (!token) {
      setMessage("Please log in to add to an exhibition.");
      return;
    }

    if (!selectedExhibitionId) {
      setMessage("Please select an exhibition.");
      return;
    }

    setAddingArtwork(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/exhibitions/${selectedExhibitionId}/external-artworks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(artwork),
        }
      );

      if (response.ok) {
        setMessage(
          `"${artwork.title}" added to "${
            userExhibitions?.find(
              (exhibition) => exhibition.id === selectedExhibitionId
            )?.title
          }"`
        );
        router.push(`/exhibitions/${selectedExhibitionId}`);
      } else {
        const errorData = await response.json();
        console.error("Failed to add artwork to exhibition:", errorData);
        setMessage(errorData.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error adding artwork to exhibition:", error);
      setMessage("Error adding artwork.");
    } finally {
      setAddingArtwork(false);
    }
  };

  if (!token) {
    return <p>Log in to add this artwork to an exhibition.</p>;
  }

  if (loading) {
    return <Loading />;
  }

  if (!userExhibitions || userExhibitions.length === 0) {
    return <p>Create an exhibition to add this artwork to it.</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">
        Add to an Existing Exhibition
      </h3>
      {message && (
        <p
          className={
            message.startsWith("Failed") ? "text-red-500" : "text-green-500"
          }
        >
          {message}
        </p>
      )}
      <div className="flex items-center space-x-4">
        <select
          value={selectedExhibitionId}
          onChange={(e) => setSelectedExhibitionId(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Select an exhibition</option>
          {userExhibitions.map((exhibition) => (
            <option key={exhibition.id} value={exhibition.id}>
              {exhibition.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddToExhibition}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          disabled={!selectedExhibitionId || addingArtwork}
        >
          {addingArtwork ? "Adding..." : "Add to Exhibition"}
        </button>
      </div>
    </div>
  );
};

export default AddToExhibition;
