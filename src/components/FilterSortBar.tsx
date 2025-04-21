"use client";

import { useState } from "react";
import { ArtObject, FilterSortProps, SortOption } from "@/types/artworks";
import ArtCard from "@/components/ArtCard";

type Props = FilterSortProps & {
  loadMore: () => void;
};

export default function FilterSortBar({ artworks, loadMore }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [sourceFilter, setSourceFilter] = useState<Record<string, boolean>>({
    Harvard: true,
    Met: true,
    vam: true,
  });

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

  const filteredArtworks = artworks
    .filter((art) => sourceFilter[art.source])
    .sort((a, b) => {
      const result = compareArtworks(a, b);
      return sortOrder === "asc" ? result : -result;
    });

  return (
    <section>
      <h1 className="text-3xl text-center mb-5 mt-5">All Paintings</h1>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <select
          className="border p-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="title">Sort by Title (A–Z)</option>
          <option value="artist">Sort by Artist (A–Z)</option>
          <option value="date">Sort by Date</option>
        </select>

        <button className="border p-2" onClick={toggleSortOrder}>
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>

        {Object.keys(sourceFilter).map((source) => (
          <label key={source} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={sourceFilter[source]}
              onChange={() => toggleSource(source)}
            />
            {source}
          </label>
        ))}
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtworks.map((artwork) => (
          <li key={`${artwork.source}-${artwork.id}`}>
            <ArtCard artwork={artwork} />
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-6">
        <button onClick={loadMore} className="p-3 mb-6 border">
          Load More
        </button>
      </div>
    </section>
  );
}
