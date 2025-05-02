import { ArtObject } from "@/types/artworks";

const HARVARD_API_KEY = process.env.NEXT_PUBLIC_HARVARD_API_KEY;

export async function fetchHarvardArtById(
  id: string
): Promise<ArtObject | null> {
  const response = await fetch(
    `https://api.harvardartmuseums.org/object/${id}?apikey=${HARVARD_API_KEY}&fields=title,people,dated,primaryimageurl,images,url,id,medium,culture,terms,creditline`
  );

  if (!response.ok) return null;

  const record = await response.json();

  const mediumFromTerms = record.terms?.medium?.[0]?.name || null;

  return {
    id: record.id.toString(),
    title: record.title || "Untitled",
    artist: record.people?.map((p: any) => p.name).join(", ") || "Unknown",
    date: record.dated || "Unknown",
    image: record.primaryimageurl || record.images?.[0]?.baseimageurl || null,
    url: `https://harvardartmuseums.org/collections/object/${record.id}`,
    source: "Harvard",
    description: record.medium || null,
    medium: mediumFromTerms,
    culture: record.culture || null,
    creditLine: record.creditline || null,
  };
}
