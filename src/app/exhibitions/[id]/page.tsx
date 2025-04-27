import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExhibitionPageProps } from "@/types/exhibitions";
import CreateArtworkForm from "@/components/CreateArtworkForm";
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
      <h1 className="text-2xl font-bold mb-6">
        Exhibition: {exhibition.title}
      </h1>
      <p className="text-xl mb-6">
        {exhibition.location} | {exhibition.category}
      </p>

      <CreateArtworkForm exhibitionId={id} />

      <h2 className="text-3xl mt-8 mb-4 font-semibold">Artworks</h2>
      {exhibition.artworks.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {exhibition.artworks.map((artwork) => (
            <li key={artwork.id} className="overflow-hidden">
              <Link href={`/userArtworks/${artwork.id}`}>
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-64 object-cover hover:opacity-80 transition duration-200"
                />
                <div className="p-4">
                  <h3 className="text-2xl font-semibold">{artwork.title}</h3>
                  <p className="text-lg mt-2">by {artwork.artist}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg">No artworks yet for this exhibition</p>
      )}
    </div>
  );
}
