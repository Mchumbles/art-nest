"use client";

import { useEffect, useState } from "react";
import { fetchHarvardPaintings } from "@/api/harvard";
import { fetchMetPaintings } from "@/api/met";
import { fetchVamPaintings } from "@/api/vam";
import { ArtObject } from "@/types/artworks";
import FilterSortBar from "@/components/FilterSortBar";

export default function PaintingsPage() {
  const [paintings, setPaintings] = useState<ArtObject[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadPaintings = async () => {
      const [harvard, met, vam] = await Promise.all([
        fetchHarvardPaintings(page),
        fetchMetPaintings(page),
        fetchVamPaintings(page),
      ]);

      setPaintings((prev) => [...prev, ...harvard, ...met, ...vam]);
    };

    loadPaintings();
  }, [page]);

  return (
    <FilterSortBar
      artworks={paintings}
      loadMore={() => setPage((prev) => prev + 1)}
    />
  );
}
