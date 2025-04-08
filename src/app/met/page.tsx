"use client";

//The MET

import React, { useState, useEffect } from "react";

type Painting = {
  id: string;
  title: string;
  artist: string;
  year: string | null;
  image: string | null;
  url: string;
};

const MetPaintingsPage = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        const searchResponse = await fetch(
          "https://collectionapi.metmuseum.org/public/collection/v1/search?q=paintings&isHighlight=true&size=10"
        );

        if (!searchResponse.ok) {
          throw new Error("Failed to fetch search data");
        }

        const searchData = await searchResponse.json();
        const objectIDs = searchData.objectIDs || [];

        const perPage = 10;
        const batchIDs = objectIDs.slice(0, perPage);

        const batchPromises = batchIDs.map(async (objectID: number) => {
          const detailResponse = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
          );
          const detailData = await detailResponse.json();

          return {
            id: detailData.objectID.toString(),
            title: detailData.title || "Unknown",
            artist: detailData.artistDisplayName || "Unknown",
            year: detailData.objectDate || "Unknown",
            image: detailData.primaryImageSmall || null,
            url: detailData.objectURL || "#",
          };
        });

        const paintingsWithDetails = await Promise.all(batchPromises);
        setPaintings(paintingsWithDetails);
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
      <h1 className="mb-4 text-center text-5xl">Met Collection Paintings</h1>
      <ul>
        {paintings.map((painting) => (
          <li key={painting.id} className="mb-4 text-2xl">
            <p>ID: {painting.id}</p>
            <h3>Title: {painting.title}</h3>
            <p>Artist: {painting.artist}</p>
            <p>Year: {painting.year}</p>
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

export default MetPaintingsPage;
