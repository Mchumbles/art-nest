import { ArtObject } from "@/types/artworks";

export async function fetchMetArtById(id: string): Promise<ArtObject | null> {
  const response = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
  );

  if (!response.ok) return null;

  const record = await response.json();

  return {
    id: record.objectID.toString(),
    title: record.title || "Untitled",
    artist: record.artistDisplayName || "Unknown",
    date: record.objectDate || "Unknown",
    image: record.primaryImage || null,
    url: `https://www.metmuseum.org/art/collection/search/${record.objectID}`,
    source: "Met",
    description: record.objectDescription || null,
    medium: record.medium || null,
    culture: record.culture || null,
    objectWikidata_URL: record.objectWikidata_URL || null,
    creditLine: record.creditLine || null,
  };
}
