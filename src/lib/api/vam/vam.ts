import { ArtObject } from "@/types/artworks";

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

export async function fetchVamArt(
  category: string,
  page = 1
): Promise<ArtObject[]> {
  const keyword = category.toLowerCase();

  const response = await fetch(
    `https://api.vam.ac.uk/v2/objects/search?q=${encodeURIComponent(
      keyword
    )}&images_exist=1&size=10&page=${page}&fields=systemNumber,_primaryTitle,_primaryMaker,_primaryDate,_primaryImageId`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch V&A artworks");
  }

  const data = await response.json();
  const records = data.records || [];

  if (records.length === 0) {
    console.warn(`No results found for keyword: ${keyword}`);
  }

  return records.map((record: any) => ({
    id: record.systemNumber,
    title: record._primaryTitle || "Unknown",
    artist: record._primaryMaker?.name || "Unknown",
    date: record._primaryDate || "Unknown",
    image: record._primaryImageId
      ? `https://framemark.vam.ac.uk/collections/${record._primaryImageId}/full/full/0/default.jpg`
      : null,
    url: `https://collections.vam.ac.uk/item/${record.systemNumber}`,
    source: "vam",
  }));
}
