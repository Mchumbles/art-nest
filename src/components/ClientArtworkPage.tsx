"use client";

import { ArtObject } from "@/types/artworks";
import AddToExhibition from "@/components/AddExternalArtwork";
import Image from "next/image";

export default function ClientArtworkPage({
  artwork,
}: {
  artwork: ArtObject | null;
}) {
  if (!artwork) return <div role="alert">Artwork not found.</div>;

  return (
    <main className="container mx-auto p-4" aria-labelledby="artwork-title">
      <h1 id="artwork-title" className="text-3xl text-center mb-5 mt-5">
        {artwork.title}
      </h1>

      <figure className="text-center mb-4">
        <Image
          src={artwork.image || "/"}
          alt={artwork.title || "Artwork image"}
          className="max-w-full h-auto rounded-md shadow-md"
          width={500}
          height={500}
        />
        <figcaption className="text-sm text-gray-500 mt-2">
          {artwork.artist ? `By ${artwork.artist}` : "Artist unknown"}
        </figcaption>
      </figure>

      <section className="mt-4">
        <p className="text-lg font-semibold">Artist: {artwork.artist}</p>
        <p className="text-gray-600">Date: {artwork.date}</p>
        {artwork.culture && (
          <p className="text-gray-600">Culture: {artwork.culture}</p>
        )}
        {artwork.medium && (
          <p className="text-gray-600">Medium: {artwork.medium}</p>
        )}
      </section>

      {artwork.description && (
        <section className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{artwork.description}</p>
        </section>
      )}

      <div className="mt-4 text-center">
        <a
          href={artwork.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View on {artwork.source} website
        </a>
      </div>

      <div className="mt-6">
        <AddToExhibition artwork={artwork} />
      </div>
    </main>
  );
}
