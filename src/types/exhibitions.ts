//components/ExhibitionGallery.tsx
export interface ExhibitionDetails {
  id: string;
  title: string;
  location: string;
  category: string;
  createdAt: string;
}

//components/AddExternalArtwork.tsx
export interface Exhibition {
  id: string;
  title: string;
}

export interface ExhibitionPageProps {
  params: { id: string };
}

export interface DeleteExhibitionButtonProps {
  id: string;
}
