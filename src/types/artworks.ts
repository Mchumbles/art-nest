export type ArtObject = {
  id: string;
  title: string;
  artist: string;
  date?: string | null;
  year?: string | null;
  image: string | null;
  url: string;
  source: string;
};

export type VamPainting = {
  systemNumber: string;
  _primaryTitle: string;
  _primaryMaker?: { name: string };
  _primaryDate?: string;
  _primaryImageId?: string;
};
