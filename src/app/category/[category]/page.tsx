"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchHarvardArt } from "@/lib/api/harvard/harvard";
import { fetchMetArt } from "@/lib/api/met/met";
import { fetchVamArt } from "@/lib/api/vam/vam";
import { ArtObject, SortOption } from "@/types/artworks";
import ArtCard from "@/components/ArtCard";
import FilterSortBar from "@/components/FilterSortBar";
import Loading from "@/components/Loading";

export default function CategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<ArtObject[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sourceFilter, setSourceFilter] = useState<Record<string, boolean>>({
    Harvard: true,
    Met: true,
    vam: true,
  });

  const initialCategory = params?.category
    ? decodeURIComponent(params.category as string)
    : null;
  const title = initialCategory
    ? `${initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)}`
    : "All Artworks";

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

  const toggleSource = (source: string) => {
    setSourceFilter((prev) => ({
      ...prev,
      [source]: !prev[source],
    }));
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getComparableDate = (art: ArtObject): number => {
    const year = art.date ? parseInt(art.date, 10) : NaN;
    return isNaN(year) ? 0 : year;
  };

  const compareArtworks = (a: ArtObject, b: ArtObject): number => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "artist":
        return a.artist.localeCompare(b.artist);
      case "date":
        return getComparableDate(a) - getComparableDate(b);
      default:
        return 0;
    }
  };

  const filteredAndSortedArtworks = artworks
    .filter((art) => sourceFilter[art.source])
    .sort((a, b) => {
      const result = compareArtworks(a, b);
      return sortOrder === "asc" ? result : -result;
    });

  return (
    <section>
      <h1 className="text-3xl text-center mb-5 mt-5" id="category-title">
        {title}
      </h1>

      <FilterSortBar
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        loading={loading}
      />

      <section
        aria-live="polite"
        className="min-h-[calc(100vh - var(--navbar-height))]"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loading />
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedArtworks.map((artwork) => (
              <li
                key={`${artwork.source}-${artwork.id}`}
                aria-labelledby={`artwork-${artwork.id}`}
              >
                <ArtCard artwork={artwork} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav
        aria-label="Pagination"
        className="flex justify-center gap-4 mt-6 mb-10"
      >
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          className="p-3 border"
          disabled={page === 1 || loading}
          aria-label="Previous page"
        >
          Previous
        </button>

        <span className="p-3">{`Page ${page}`}</span>

        <button
          onClick={() => setPage(page + 1)}
          className="p-3 border"
          disabled={loading}
          aria-label="Next page"
        >
          Next
        </button>
      </nav>
    </section>
  );
}
