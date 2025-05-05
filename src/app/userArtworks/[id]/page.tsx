import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/DeleteArtworkButton";
// import EditArtworkForm from "@/components/EditArtworkForm";
import { UserArtworkPageProps } from "@/types/artworks";

export default async function UserArtworkPage({
  params,
}: UserArtworkPageProps) {
  const { id } = await params;

  const artwork = await prisma.artwork.findUnique({
    where: { id },
    include: { exhibition: true },
  });

  if (!artwork) return notFound();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{artwork.title}</h1>
      <p className="text-xl mb-2">Artist: {artwork.artist}</p>
      <p className="text-lg mb-2">Date: {artwork.date || "Unknown date"}</p>
      {artwork.medium && (
        <p className="text-lg mb-2">Medium: {artwork.medium}</p>
      )}
      {artwork.culture && (
        <p className="text-lg mb-2">Culture: {artwork.culture}</p>
      )}
      {artwork.creditLine && (
        <p className="text-lg mb-2">Credit Line: {artwork.creditLine}</p>
      )}
      {artwork.description && (
        <p className="text-lg mb-6">Description: {artwork.description}</p>
      )}

      {artwork.image && (
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-96 object-cover border rounded-md mb-6"
        />
      )}
      {artwork.exhibition && (
        <p className="text-lg mb-2">Exhibition: {artwork.exhibition.title}</p>
      )}
      {artwork.url && (
        <a
          href={artwork.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 underline mt-4 mb-6"
        >
          View artwork on {artwork.source} website
        </a>
      )}

      <DeleteButton id={artwork.id} exhibitionId={artwork.exhibitionId} />
      {/* <EditArtworkForm artworkId={artwork.id} /> */}
    </div>
  );
}
