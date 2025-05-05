"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchHarvardArtById } from "@/lib/api/harvard/fetchHarvardArtById";
import { fetchMetArtById } from "@/lib/api/met/fetchMetArtById";
import { fetchVamArtById } from "@/lib/api/vam/fetchVamArtById";
import { ArtObject } from "@/types/artworks";
import Loading from "@/components/Loading";
import AddToExhibition from "@/components/AddExternalArtwork";

export default function ApiArtworkPage() {
  const params = useParams();
  const source = params?.source as string | undefined;
  const id = params?.id as string | undefined;

  const [artwork, setArtwork] = useState<ArtObject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!source || !id) return;

    const fetchArtwork = async () => {
      setLoading(true);
      let fetchedArtwork: ArtObject | null = null;

      switch (source) {
        case "harvard":
          fetchedArtwork = await fetchHarvardArtById(id);
          break;
        case "met":
          fetchedArtwork = await fetchMetArtById(id);
          break;
        case "vam":
          fetchedArtwork = await fetchVamArtById(id);
          break;
        default:
          break;
      }

      setArtwork(fetchedArtwork);
      setLoading(false);
    };

    fetchArtwork();
  }, [source, id]);

  if (loading) {
    return <Loading />;
  }

  if (!artwork) {
    return <div>Artwork not found.</div>;
  }

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-3xl text-center mb-5 mt-5">{artwork.title}</h1>
      <div className="text-center mb-4">
        <img
          src={artwork.image || "/"}
          alt={artwork.title}
          className="max-w-full h-auto rounded-md shadow-md"
        />
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold">Artist: {artwork.artist}</p>
        <p className="text-gray-600">Date: {artwork.date}</p>
        {artwork.culture && (
          <p className="text-gray-600">Culture: {artwork.culture}</p>
        )}
        {artwork.medium && (
          <p className="text-gray-600">Medium: {artwork.medium}</p>
        )}

        {artwork.description ? (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{artwork.description}</p>
          </div>
        ) : (
          artwork.source === "Met" && (
            <div className="mt-4">
              <p className="text-gray-700 text-center">
                For more information about this artwork, please follow the link
                below to the Met's website.
              </p>
            </div>
          )
        )}

        {artwork.creditLine && (
          <p className="text-sm text-gray-500 mt-3 text-center">
            {artwork.source}: {artwork.creditLine}
          </p>
        )}

        <a
          href={artwork.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 underline mt-4 text-center w-full"
        >
          View on {artwork.source} website
        </a>
        {artwork && <AddToExhibition artwork={artwork} />}
      </div>
    </section>
  );
}
