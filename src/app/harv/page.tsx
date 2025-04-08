"use client";

//Harvard Art Museum

import React, { useState, useEffect } from "react";

type ArtObject = {
  id: string;
  title: string;
  artist: string;
  dated: string | null;
  image: string | null;
  url: string;
};

const HarvardArtPage = () => {
  const [artworks, setArtworks] = useState<ArtObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const searchResponse = await fetch(
          `https://api.harvardartmuseums.org/object?apikey=${process.env.NEXT_PUBLIC_HARVARD_API_KEY}&size=10&q=paintings`
        );

        if (!searchResponse.ok) {
          throw new Error("Failed to fetch search data");
        }

        const searchData = await searchResponse.json();
        const artObjects = searchData.records || [];

        const batchPromises = artObjects.map(async (artObject: any) => {
          const detailResponse = await fetch(
            `https://api.harvardartmuseums.org/object/${artObject.id}?apikey=${process.env.NEXT_PUBLIC_HARVARD_API_KEY}`
          );
          const detailData = await detailResponse.json();

          const dated =
            detailData.dating?.string || detailData.dated || "Unknown";

          return {
            id: detailData.id.toString(),
            title: detailData.title || "Unknown",
            artist:
              detailData.people?.map((person: any) => person.name).join(", ") ||
              "Unknown",
            dated: dated,
            image: detailData.images?.[0]?.baseimageurl || null,
            url: `https://harvardartmuseums.org/collections/object/${detailData.id}`,
          };
        });

        const artworksWithDetails = await Promise.all(batchPromises);
        setArtworks(artworksWithDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section>
      <h1 className="mb-4 text-center text-5xl">
        Harvard Art Museums Collection
      </h1>
      <ul>
        {artworks.map((artwork) => (
          <li key={artwork.id} className="mb-4 text-2xl">
            <p>ID: {artwork.id}</p>
            <h3>Title: {artwork.title}</h3>
            <p>Artist: {artwork.artist}</p>
            <p>Year: {artwork.dated}</p>
            {artwork.image ? (
              <img
                src={artwork.image}
                alt={artwork.title}
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

export default HarvardArtPage;
