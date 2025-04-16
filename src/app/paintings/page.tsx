import { fetchHarvardPaintings } from "@/api/harvard";
import { fetchMetPaintings } from "@/api/met";
import { fetchVamPaintings } from "@/api/vam";
import { ArtObject } from "@/types/artworks";
import FilterSortBar from "@/components/FilterSortBar";

export default async function PaintingsPage() {
  const [harvardPaintings, metPaintings, vamPaintings] = await Promise.all([
    fetchHarvardPaintings(),
    fetchMetPaintings(),
    fetchVamPaintings(),
  ]);

  const allPaintings: ArtObject[] = [
    ...harvardPaintings,
    ...metPaintings,
    ...vamPaintings,
  ];

  return <FilterSortBar artworks={allPaintings} />;
}
