export type ArtObject = {
  id: string;
  title: string;
  artist: string;
  date?: string | null;
  image: string | null;
  url: string;
  source: string;
};

export type FilterSortData = {
  artworks: ArtObject[];
};

export type FilterSortComponentProps = FilterSortData & {
  page: number;
  setPage: (page: number) => void;
  title?: string;
  loading?: boolean;
};

export type SortOption = "title" | "date" | "artist";
