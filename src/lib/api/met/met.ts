import { ArtObject } from "@/types/artworks";
import { mediumMap } from "@/constants/categories";

//Reference for returned object data
/**
artworkReference = {
  id: "764095",
  title: "Christ Carrying the Cross, called 'The Lord of the Fall'",
  artist: "Unknown (Cuzco Artist, Peru, second half 18th century)",
  dated: "ca. 1770–75",
  year: "1770",
  medium: "Oil and gold on canvas",
  image: "https://images.metmuseum.org/CRDImages/ad/web-large/DP-18755-007.jpg",
  url: "https://www.metmuseum.org/art/collection/search/764095",
  }
 */
//Reference for API Queries
/**
const queryParams = {
  q: "Search term (e.g., 'paintings')",  
  isHighlight: "Filter by highlight status (true or false)", 
  objectID: "Get object by its unique objectID (e.g., 764095)",
  hasImages: "Filter to return only objects with images (true or false)", 
  classification: "Filter by classification (e.g., 'Paintings')", 
  artistDisplayName: "Filter by artist name (e.g., 'Pablo Picasso')",
  medium: "Filter by medium (e.g., 'Oil on canvas')", 
  dateBegin: "Start year for date range filter (e.g., '1900')", 
  dateEnd: "End year for date range filter (e.g., '2000')", 
  country: "Filter by the object's country of origin (e.g., 'France')", 
  period: "Filter by period (e.g., 'Modern')", 
  size: "Number of records per page (Max 100)", 
  page: "Page number for pagination (e.g., '1')",
  fields: "Fields to return in the response (e.g., 'objectID,title,artistDisplayName')",
};
 */

export async function fetchMetArt(
  category: string,
  page = 1
): Promise<ArtObject[]> {
  const medium = mediumMap[category.toLowerCase()] || category;
  const pageSize = 10;
  const fetchSize = 30;

  const response = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(
      category
    )}&hasImages=true&medium=${encodeURIComponent(medium)}`
  );

  if (!response.ok) throw new Error("Failed to fetch MET search data");

  const data = await response.json();
  const objectIDs = data.objectIDs || [];

  const start = (page - 1) * fetchSize;
  const end = start + fetchSize;
  const paginated = objectIDs.slice(start, end);

  const artworks: ArtObject[] = [];

  for (const id of paginated) {
    try {
      const detail = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
      );
      if (!detail.ok) {
        continue;
      }

      const artwork = await detail.json();
      if (!artwork.primaryImageSmall) continue;

      artworks.push({
        id: artwork.objectID.toString(),
        title: artwork.title || "Unknown",
        artist: artwork.artistDisplayName || "Unknown",
        date: artwork.objectDate || "Unknown",
        image: artwork.primaryImageSmall,
        url: artwork.objectURL,
        source: "Met",
      });

      if (artworks.length >= pageSize) break;
    } catch {
      continue;
    }
  }

  return artworks;
}
