import { fetchHarvardPaintings } from "@/api/harvard";
import { fetchMetPaintings } from "@/api/met";
import { fetchVamPaintings } from "@/api/vam";
import { ArtObject } from "@/types/artworks";
import FilterSortBar from "@/components/FilterSortBar";

export default function PaintingsPage() {
  return <FilterSortBar />;
}
