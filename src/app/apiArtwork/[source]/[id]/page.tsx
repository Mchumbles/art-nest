import { fetchHarvardArtById } from "@/lib/api/harvard/fetchHarvardArtById";
import { fetchMetArtById } from "@/lib/api/met/fetchMetArtById";
import { fetchVamArtById } from "@/lib/api/vam/fetchVamArtById";
import { ArtObject } from "@/types/artworks";
import ClientArtworkPage from "@/components/ClientArtworkPage";

interface PageProps {
  params: {
    source: string;
    id: string;
  };
}

export default async function ApiArtworkPage({ params }: PageProps) {
  const { source, id } = params;

  let artwork: ArtObject | null = null;

  switch (source) {
    case "harvard":
      artwork = await fetchHarvardArtById(id);
      break;
    case "met":
      artwork = await fetchMetArtById(id);
      break;
    case "vam":
      artwork = await fetchVamArtById(id);
      break;
    default:
      break;
  }

  return <ClientArtworkPage artwork={artwork} />;
}
