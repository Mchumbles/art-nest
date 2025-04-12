import { ArtObject } from "../types/artworks";

//Reference for returned object data
/**
artworkReference = {
  id: "184243",
  title: "George F. F. Lombard (1911-2004)",
  artist: "Pettee",
  dated: "1970",
  image: "https://nrs.harvard.edu/urn-3:HUAM:783757",
  medium: "Oil on canvas",
  classification: "Paintings",
  culture: "American",
  url: "https://www.harvardartmuseums.org/collections/object/184243",
};
 */
//Reference for API Queries
/** 
const queryParams = {
    classification: "Filter by classification (e.g., 'Paintings')",
    medium: "Filter by medium (e.g., 'Oil on canvas')",
    period: "Filter by period (e.g., 'Modern')",
    style: "Filter by style (e.g., 'Bauhaus')",
    hasimage: "Only return objects with images (1 = true)",
    q: "Free-text search (e.g., 'Albers')",
    datebegin: "Start date for filter (e.g., '1900')",
    dateend: "End date for filter (e.g., '2000')",
    size: "Number of records per page (Max 100)",
    page: "Page number for pagination",
    sort: "Sort results by field (e.g., 'datebegin')",
    fields: "Fields to return (e.g., 'title,people,image')",
    id: "Get object by ID (e.g., '/object/{id}')"
  };
*/

export async function fetchHarvardPaintings(): Promise<ArtObject[]> {
  const page = 1;
  const response = await fetch(
    `https://api.harvardartmuseums.org/object?apikey=${process.env.NEXT_PUBLIC_HARVARD_API_KEY}&size=10&classification=Paintings&hasimage=1&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Harvard artworks");
  }

  const data = await response.json();
  const records = data.records || [];

  const artworks = records.map((record: any) => ({
    id: record.id.toString(),
    title: record.title || "Unknown",
    artist: record.people?.map((p: any) => p.name).join(", ") || "Unknown",
    date: record.dated || "Unknown",
    image: record.images?.[0]?.baseimageurl || null,
    url: `https://harvardartmuseums.org/collections/object/${record.id}`,
    source: "Harvard",
  }));

  return artworks;
}
