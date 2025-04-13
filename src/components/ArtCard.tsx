import { ArtObject } from "@/types/artworks";

export default function ArtCard({ artwork }: { artwork: ArtObject }) {
  return (
    <div className="border p-4 shadow-md flex flex-col min-h-[550px]">
      <h4 className="text-xl mb-2">Title: {artwork.title}</h4>
      <p>Artist: {artwork.artist}</p>
      <p>Date: {artwork.date}</p>
      <p>Source: {artwork.source}</p>
      <div className="w-full aspect-[4/3] overflow-hidden mt-4">
        {artwork.image ? (
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover"
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
      >
        View on {artwork.source} website
      </a>
    </div>
  );
}
