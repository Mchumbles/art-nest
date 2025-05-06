import Link from "next/link";
import { ArtObject } from "@/types/artworks";
import Image from "next/image";

export default function ArtCard({ artwork }: { artwork: ArtObject }) {
  return (
    <div
      className="border p-4 shadow-md flex flex-col min-h-[550px]"
      role="article"
    >
      <h4 className="text-xl mb-2">
        <Link
          href={`/apiArtwork/${artwork.source.toLowerCase()}/${artwork.id}`}
          className="text-blue-600 underline"
          aria-label={`View details for ${artwork.title} by ${artwork.artist}`}
        >
          Title: {artwork.title}
        </Link>
      </h4>
      <p>
        <strong>Artist:</strong> {artwork.artist || "Unknown"}
      </p>
      <p>
        <strong>Date:</strong> {artwork.date || "Unknown date"}
      </p>
      <p>
        <strong>Source:</strong> {artwork.source}
      </p>

      <div className="w-full aspect-[4/3] overflow-hidden mt-4">
        {artwork.image ? (
          <Image
            src={artwork.image}
            alt={artwork.title || "Artwork image"}
            className="w-full h-full object-cover"
            loading="lazy"
            aria-describedby={`artwork-description-${artwork.id}`}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            No image
          </div>
        )}
      </div>

      <a
        href={artwork.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline mt-auto"
        aria-label={`View artwork on ${artwork.source} website`}
      >
        View on {artwork.source} website
      </a>

      <p id={`artwork-description-${artwork.id}`} className="sr-only">
        {artwork.title} by {artwork.artist} - {artwork.date}
      </p>
    </div>
  );
}
