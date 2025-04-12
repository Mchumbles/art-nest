import { ArtObject, VamPainting } from "@/types/artworks";

//Reference for returned object data
/**
artworkReference = {
  systemNumber: "O429002", (id)
  _primaryTitle: "Krishna painting Radha", // _primaryTitle (Title of the artwork)
  _primaryMaker: "Keyt, George", // _primaryMaker.name (Artist's name)
  _primaryDate: "1948", // _primaryDate (Date of the artwork, typically the year)
  image: "https://framemark.vam.ac.uk/collections/2006AM2326/full/full/0/default.jpg", // _images._iiif_image_base_url (Image URL generated using _primaryImageId)
  url: "https://collections.vam.ac.uk/item/O429002", // systemNumber (URL to the artwork in the V&A collection)
}
*/
//Reference for API Queries
/**
const queryParams = {
  q: "Search term (e.g., 'paintings')",  
  objectType: "Filter by object type (e.g., 'Painting')",  
  artistDisplayName: "Filter by artist name (e.g., 'George Keyt')",  
  classification: "Filter by classification (e.g., 'Paintings')",  
  dateBegin: "Start year for date range filter (e.g., '1900')",  
  dateEnd: "End year for date range filter (e.g., '2000')",  
  size: "Number of records per page (Max 100)",  
  page: "Page number for pagination (e.g., '1')",  
  fields: "Fields to return in the response (e.g., 'systemNumber,_primaryTitle,_primaryMaker,_primaryDate,_primaryImageId')", 
};
*/

export async function fetchVamPaintings(): Promise<ArtObject[]> {
  try {
    const searchResponse = await fetch(
      "https://api.vam.ac.uk/v2/objects/search?q=painting&size=10&object_type=Painting&fields=systemNumber,_primaryTitle,_primaryMaker,_primaryDate,_primaryImageId"
    );

    if (!searchResponse.ok) {
      throw new Error("Failed to fetch search data from V&A");
    }

    const searchData = await searchResponse.json();
    const records: VamPainting[] = searchData.records || [];

    const artworks = await Promise.all(
      records.map(async (painting) => {
        const artwork: ArtObject = {
          id: painting.systemNumber,
          title: painting._primaryTitle || "Unknown",
          artist: painting._primaryMaker?.name || "Unknown",
          date: painting._primaryDate || "Unknown",
          image: painting._primaryImageId
            ? `https://framemark.vam.ac.uk/collections/${painting._primaryImageId}/full/full/0/default.jpg`
            : null,
          url: `https://collections.vam.ac.uk/item/${painting.systemNumber}`,
          source: "V&A",
        };
        return artwork;
      })
    );

    return artworks.filter((artwork) => artwork !== null) as ArtObject[];
  } catch (error) {
    console.error("Error fetching V&A paintings:", error);
    throw error;
  }
}
