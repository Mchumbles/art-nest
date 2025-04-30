"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchHarvardArt } from "@/pages/api/harvard";
import { fetchMetArt } from "@/pages/api/met";
import { fetchVamArt } from "@/pages/api/vam";
import { ArtObject } from "@/types/artworks";
import FilterSortBar from "@/components/FilterSortBar";

export default function CategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<ArtObject[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params?.category && typeof params.category === "string") {
      const decodedCategory = decodeURIComponent(params.category);
      setCategory(decodedCategory);
      setPage(1);
    }
  }, [params]);

  useEffect(() => {
    if (!category) return;

    const loadArtworks = async () => {
      setLoading(true);
      try {
        const [harvard, met, vam] = await Promise.all([
          fetchHarvardArt(category, page),
          fetchMetArt(category, page),
          fetchVamArt(category, page),
        ]);

        setArtworks([...harvard, ...met, ...vam]);
      } catch (err) {
        console.error("Failed to load artworks:", err);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, [category, page]);

  return (
    <FilterSortBar
      artworks={artworks}
      page={page}
      setPage={setPage}
      title={category || "Loading..."}
      loading={loading}
    />
  );
}
