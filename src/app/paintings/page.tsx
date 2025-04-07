"use client";

//Victoria and Albert Museum Paintings

import React, { useState, useEffect } from "react";

type Painting = {
  id: string;
  title: string;
  artist: string;
  image: string;
};

const PaintingsPage = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        const response = await fetch(
          "https://api.vam.ac.uk/v2/objects/search?q=painting&size=10"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        const paintingsWithImages = data.records.map((painting: any) => ({
          id: painting.systemNumber,
          title: painting._primaryTitle || "Unknown",
          artist: painting._primaryMaker?.name || "Unknown",
          image: painting._primaryImageId
            ? `https://framemark.vam.ac.uk/collections/${painting._primaryImageId}/full/full/0/default.jpg`
            : null,
        }));

        setPaintings(paintingsWithImages);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section>
      <h1 className="mb-4 text-center text-5xl">
        Victoria and Albert Museum Paintings
      </h1>
      <ul>
        {paintings.map((painting) => (
          <li key={painting.id} className="mb-4 text-2xl">
            <p>ID: {painting.id}</p>
            <h3>Title: {painting.title}</h3>
            <p>Artist: {painting.artist}</p>
            {painting.image ? (
              <img
                src={painting.image}
                alt={painting.title}
                className="w-[500px]"
              />
            ) : (
              <p>No image available</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PaintingsPage;
