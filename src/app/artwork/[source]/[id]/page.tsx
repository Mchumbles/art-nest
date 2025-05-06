import { notFound } from "next/navigation";
import { fetchHarvardArtById } from "@/lib/api/harvard/fetchHarvardArtById";
import { fetchMetArtById } from "@/lib/api/met/fetchMetArtById";
import { fetchVamArtById } from "@/lib/api/vam/fetchVamArtById";
import { ArtObject } from "@/types/artworks";
import Loading from "@/components/Loading";
import Image from "next/image";

type Params = {
  params: {
    source: string;
    id: string;
  };
};

export default async function ArtworkPage({ params }: Params) {
  const { source, id } = params;

  let artwork: ArtObject | null = null;
  let isLoading = true;

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
  } finally {
    isLoading = false;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!artwork) {
    notFound();
  }

  return (
    <main className="p-6" aria-labelledby="artwork-title">
      <h1 id="artwork-title" className="text-3xl font-bold mb-4">
        {artwork.title}
      </h1>

      <section aria-labelledby="artwork-info">
        <h2 id="artwork-info" className="sr-only">
          Artwork Information
        </h2>
        <p className="text-lg mb-2">
          <strong>Artist:</strong> {artwork.artist || "Unknown"}
        </p>
        <p className="text-lg mb-2">
          <strong>Date:</strong> {artwork.date || "Unknown"}
        </p>
        <p className="text-lg mb-2">
          <strong>Source:</strong> {artwork.source}
        </p>
      </section>

      {artwork.image && (
        <figure className="mt-6">
          <Image
            src={artwork.image}
            alt={artwork.title || "Artwork image"}
            className="max-w-full"
          />
          <figcaption className="text-sm text-gray-600 mt-2 text-center">
            {artwork.artist ? `By ${artwork.artist}` : "Artist unknown"}
          </figcaption>
        </figure>
      )}

      <nav className="mt-6" aria-label="External link">
        <a
          href={artwork.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          View on official site
        </a>
      </nav>
    </main>
  );
}
