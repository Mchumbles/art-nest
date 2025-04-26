import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExhibitionPageProps } from "@/types/exhibitions";

export default async function ExhibitionPage({ params }: ExhibitionPageProps) {
  const { id } = await params;

  const exhibition = await prisma.exhibition.findUnique({
    where: { id },
    include: { artworks: true },
  });

  if (!exhibition) return notFound();

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">{exhibition.title}</h1>
      <p>
        {exhibition.location} | {exhibition.category}
      </p>

      <h2 className="text-2xl mt-8 mb-4">Artworks</h2>
      {exhibition.artworks.length > 0 ? (
        <ul className="">
          {exhibition.artworks.map((artwork) => (
            <li key={artwork.id} className="">
              <img src={artwork.image} alt={artwork.title} className="" />
              <h3 className="">{artwork.title}</h3>
              <p className="">by {artwork.artist}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No artworks yet for this exhibition</p>
      )}
    </div>
  );
}
