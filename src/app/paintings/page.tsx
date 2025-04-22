"use client";

import { useEffect, useState, useRef } from "react";
import { fetchHarvardPaintings } from "@/pages/api/harvard";
import { fetchMetPaintings } from "@/pages/api/met";
import { fetchVamPaintings } from "@/pages/api/vam";
import { ArtObject } from "@/types/artworks";
import FilterSortBar from "@/components/FilterSortBar";

export default function PaintingsPage() {
  const [paintings, setPaintings] = useState<ArtObject[]>([]);
  const [page, setPage] = useState(1);
  const hasFetched = useRef(false);

  useEffect(() => {
    const loadPaintings = async () => {
      const [harvard, met, vam] = await Promise.all([
        fetchHarvardPaintings(page),
        fetchMetPaintings(page),
        fetchVamPaintings(page),
      ]);

      setPaintings((prev) => [...prev, ...harvard, ...met, ...vam]);
    };

    if (!hasFetched.current) {
      hasFetched.current = true;
      loadPaintings();
    }
  }, [page]);

  return (
    <FilterSortBar
      artworks={paintings}
      loadMore={() => setPage((prev) => prev + 1)}
    />
  );
}
