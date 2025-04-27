import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { UserArtworkPageProps } from "@/types/userArtworks";

export default async function UserArtworkPage({
  params,
}: UserArtworkPageProps) {
  const { id } = await params;

  const artwork = await prisma.artwork.findUnique({
    where: { id },
  });

  if (!artwork) return notFound();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{artwork.title}</h1>
      <p className="text-xl mb-2">Artist: {artwork.artist}</p>
      <p className="text-lg mb-6">
        Artwork created: {new Date(artwork.date).toLocaleDateString()}
      </p>

      <img
        src={artwork.image}
        alt={artwork.title}
        className="w-full h-96 object-cover border"
      />
    </div>
  );
}
