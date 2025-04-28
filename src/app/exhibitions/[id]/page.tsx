import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExhibitionPageProps } from "@/types/exhibitions";
import CreateArtworkForm from "@/components/CreateArtworkForm";
import DeleteExhibitionButton from "@/components/DeleteExhibitionButton";
import Link from "next/link";

export default async function ExhibitionPage({ params }: ExhibitionPageProps) {
  const { id } = await params;

  const exhibition = await prisma.exhibition.findUnique({
    where: { id },
    include: { artworks: true },
  });

  if (!exhibition) return notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exhibition: {exhibition.title}</h1>
        <DeleteExhibitionButton id={exhibition.id} />
      </div>

      <p className="text-xl mb-6">
        {exhibition.location} | {exhibition.category}
      </p>

      <CreateArtworkForm exhibitionId={id} />

      <h2 className="text-3xl mt-8 mb-4 font-semibold">Artworks</h2>

      {exhibition.artworks.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {exhibition.artworks.map((artwork) =>
            artwork.id ? (
              <li key={artwork.id} className="overflow-hidden">
                <Link href={`/userArtworks/${artwork.id}`}>
                  {artwork.image && (
                    <img
                      src={artwork.image}
                      alt={artwork.title || "Artwork"}
                      className="w-full h-64 object-cover hover:opacity-80 transition duration-200"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-2xl font-semibold">
                      {artwork.title || "Untitled"}
                    </h3>
                    <p className="text-lg mt-2">
                      {artwork.artist
                        ? `by ${artwork.artist}`
                        : "Unknown artist"}
                    </p>
                  </div>
                </Link>
              </li>
            ) : null
          )}
        </ul>
      ) : (
        <p className="text-lg">No artworks yet for this exhibition.</p>
      )}
    </div>
  );
}
