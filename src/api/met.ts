import { ArtObject } from "@/types/artworks";

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

export async function fetchMetPaintings(page = 1): Promise<ArtObject[]> {
  try {
    const searchResponse = await fetch(
      "https://collectionapi.metmuseum.org/public/collection/v1/search?q=paintings&hasImages=true"
    );

    if (!searchResponse.ok) {
      throw new Error("Failed to fetch search data from MET");
    }

    const searchData = await searchResponse.json();
    const objectIDs: number[] = searchData.objectIDs || [];

    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedIDs = objectIDs.slice(start, end);

    const batchPromises = paginatedIDs.map(async (objectID) => {
      const detailResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      );

      if (!detailResponse.ok) {
        return null;
      }

      const detailData = await detailResponse.json();

      if (
        detailData.classification === "Paintings" &&
        detailData.primaryImageSmall
      ) {
        const artwork: ArtObject = {
          id: detailData.objectID.toString(),
          title: detailData.title || "Unknown",
          artist: detailData.artistDisplayName || "Unknown",
          date: detailData.objectDate || "Unknown",
          image: detailData.primaryImageSmall || null,
          url: detailData.objectURL || "#",
          source: "Met",
        };

        return artwork;
      }

      return null;
    });

    const artworks = await Promise.all(batchPromises);
    return artworks.filter((artwork) => artwork !== null) as ArtObject[];
  } catch (error) {
    console.error("Error fetching MET paintings:", error);
    throw error;
  }
}
