import { fetchHarvardPaintings } from "@/api/harvard";
import { fetchMetPaintings } from "@/api/met";
import { fetchVamPaintings } from "@/api/vam";
import { ArtObject } from "@/types/artworks";
import ArtCard from "@/components/ArtCard";

export default async function paintings() {
  const [harvard, met, vam] = await Promise.all([
    fetchHarvardPaintings(),
    fetchMetPaintings(),
    fetchVamPaintings(),
  ]);

  const allArtworks: ArtObject[] = [...harvard, ...met, ...vam];

  return (
    <section>
      <h1 className="text-3xl text-center mb-5 mt-5">All Paintings</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allArtworks.map((artwork) => (
          <li key={artwork.id}>
            <ArtCard artwork={artwork} />
          </li>
        ))}
      </ul>
    </section>
  );
}
