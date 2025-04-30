import { ArtObject } from "@/types/artworks";

export async function fetchVamArtById(
  systemNumber: string
): Promise<ArtObject | null> {
  const searchResponse = await fetch(
    `https://api.vam.ac.uk/v2/objects/search?q=${systemNumber}`
  );
  if (!searchResponse.ok) return null;
  const searchData = await searchResponse.json();

  const objectId = searchData.records?.[0]?.systemNumber;
  if (!objectId) return null;

  const objectResponse = await fetch(
    `https://api.vam.ac.uk/v2/object/${objectId}`
  );
  if (!objectResponse.ok) return null;
  const { record } = await objectResponse.json();

  console.log(record);

  const title =
    record.titles?.[0]?.title || record.briefDescription || "Unknown";

  const artist = record.artistMakerPerson?.[0]?.name?.text || "Unknown";

  const date = record.productionDates?.[0]?.date?.text || "Unknown";

  const imageId = record.images?.[0];
  const image = imageId
    ? `https://media.vam.ac.uk/media/thira/collection_images/${imageId.substring(
        0,
        6
      )}/${imageId}.jpg`
    : null;

  return {
    id: systemNumber,
    title: title,
    artist: artist,
    date: date,
    image: image,
    source: "VAM",
    url: `https://collections.vam.ac.uk/item/${systemNumber}`,
  };
}
