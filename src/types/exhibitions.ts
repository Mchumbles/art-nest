export interface Exhibition {
  id: string;
  title: string;
  location: string;
  category: string;
  createdAt: string;
}

export interface ExhibitionPageProps {
  params: Promise<{ id: string }>;
}
