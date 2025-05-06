"use client";

import { SortOption } from "@/types/artworks";
interface FilterSortBarProps {
  sortBy: SortOption;
  setSortBy: (sortBy: SortOption) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (
    sortOrder: "asc" | "desc" | ((prevState: "asc" | "desc") => "asc" | "desc")
  ) => void;
  sourceFilter: Record<string, boolean>;
  setSourceFilter: (
    sourceFilter:
      | Record<string, boolean>
      | ((prevState: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
  loading: boolean;
}

export default function FilterSortBar({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  sourceFilter,
  setSourceFilter,
  loading = false,
}: FilterSortBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
      <select
        className="border p-2"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        disabled={loading}
        aria-label="Sort artworks by"
      >
        <option value="title">Sort by Title (A–Z)</option>
        <option value="artist">Sort by Artist (A–Z)</option>
        <option value="date">Sort by Date</option>
      </select>

      <button
        className="border p-2"
        onClick={() =>
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        }
        disabled={loading}
        aria-label={`Sort order: ${
          sortOrder === "asc" ? "Ascending" : "Descending"
        }`}
      >
        {sortOrder === "asc" ? "Ascending" : "Descending"}
      </button>

      {Object.keys(sourceFilter).map((source) => (
        <label
          key={source}
          className="flex items-center gap-1"
          aria-label={`Filter by source: ${source}`}
        >
          <input
            type="checkbox"
            checked={sourceFilter[source]}
            onChange={() =>
              setSourceFilter((prev) => ({
                ...prev,
                [source]: !prev[source],
              }))
            }
            disabled={loading}
            aria-label={`Toggle filter for ${source}`}
          />
          {source}
        </label>
      ))}
    </div>
  );
}
