import { notFound } from "next/navigation";
import {
  fetchHarvardArtById,
  fetchMetArtById,
  fetchVamArtById,
} from "@/lib/api/harvard/harvard";
import { ArtObject } from "@/types/artworks";

type Params = {
  params: {
    source: string;
    id: string;
  };
};

export default async function ArtworkPage({ params }: Params) {
  const { source, id } = params;

  let artwork: ArtObject | null = null;

  try {
    switch (source.toLowerCase()) {
      case "harvard":
        artwork = await fetchHarvardArtById(id);
        break;
      case "met":
        artwork = await fetchMetArtById(id);
        break;
      case "vam":
        artwork = await fetchVamArtById(id);
        break;
      default:
        notFound();
    }
  } catch (error) {
    console.error("Failed to fetch artwork:", error);
    notFound();
  }

  if (!artwork) {
    notFound();
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>
      <p className="text-lg mb-2">
        <strong>Artist:</strong> {artwork.artist}
      </p>
      <p className="text-lg mb-2">
        <strong>Date:</strong> {artwork.date || "Unknown"}
      </p>
      <p className="text-lg mb-2">
        <strong>Source:</strong> {artwork.source}
      </p>

      {artwork.image && (
        <img
          src={artwork.image}
          alt={artwork.title}
          className="mt-6 max-w-full"
        />
      )}

      <p className="mt-6">
        <a
          href={artwork.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          View on official site
        </a>
      </p>
    </main>
  );
}
