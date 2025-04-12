import { fetchHarvardPaintings } from "@/api/harvard";
import { fetchMetPaintings } from "@/api/met";
import { fetchVamPaintings } from "@/api/vam";
import { ArtObject } from "@/types/artworks";

export default async function ArtworksPage() {
  const [harvard, met, vam] = await Promise.all([
    fetchHarvardPaintings(),
    fetchMetPaintings(),
    fetchVamPaintings(),
  ]);

  const allArtworks: ArtObject[] = [...harvard, ...met, ...vam];

  return (
    <section>
      <h1 className="text-5xl text-center mb-6">All Artworks</h1>
      <ul>
        {allArtworks.map((artwork) => (
          <li key={artwork.id} className="mb-6">
            <h2 className="text-2xl font-semibold">Title: {artwork.title}</h2>
            <p>Artist: {artwork.artist}</p>
            <p>Date: {artwork.date}</p>
            <p>Source: {artwork.source}</p>
            {artwork.image ? (
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-[500px] my-4"
              />
            ) : (
              <p>No image</p>
            )}
            <a
              href={artwork.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              View on {artwork.source} website
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
