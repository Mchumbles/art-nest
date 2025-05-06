import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/DeleteArtworkButton";
// import EditArtworkForm from "@/components/EditArtworkForm";
import { UserArtworkPageProps } from "@/types/artworks";
import Image from "next/image";

export default async function UserArtworkPage({
  params,
}: UserArtworkPageProps) {
  const { id } = params;

  const artwork = await prisma.artwork.findUnique({
    where: { id },
    include: { exhibition: true },
  });

  if (!artwork) return notFound();

  return (
    <div className="p-8 max-w-3xl mx-auto" role="main">
      <h1 className="text-3xl font-bold mb-6" id="artwork-title">
        {artwork.title}
      </h1>

      <section aria-labelledby="artwork-title">
        <p className="text-xl mb-2">
          <strong>Artist:</strong> {artwork.artist || "Unknown artist"}
        </p>
        <p className="text-lg mb-2">
          <strong>Date:</strong> {artwork.date || "Unknown date"}
        </p>
        {artwork.medium && (
          <p className="text-lg mb-2">
            <strong>Medium:</strong> {artwork.medium}
          </p>
        )}
        {artwork.culture && (
          <p className="text-lg mb-2">
            <strong>Culture:</strong> {artwork.culture}
          </p>
        )}
        {artwork.creditLine && (
          <p className="text-lg mb-2">
            <strong>Credit Line:</strong> {artwork.creditLine}
          </p>
        )}
        {artwork.description && (
          <p className="text-lg mb-6">
            <strong>Description:</strong> {artwork.description}
          </p>
        )}
      </section>

      {artwork.image && (
        <figure className="mb-6">
          <Image
            src={artwork.image}
            alt={artwork.title || "Artwork image"}
            className="w-full h-96 object-cover border rounded-md"
            aria-describedby="artwork-description"
          />
          <figcaption id="artwork-description" className="sr-only">
            {artwork.title} by {artwork.artist}
          </figcaption>
        </figure>
      )}

      {artwork.exhibition && (
        <p className="text-lg mb-2">
          <strong>Exhibition:</strong> {artwork.exhibition.title}
        </p>
      )}

      {artwork.url && (
        <a
          href={artwork.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 underline mt-4 mb-6"
          aria-label={`View artwork on ${artwork.source} website`}
        >
          View artwork on {artwork.source} website
        </a>
      )}

      <DeleteButton id={artwork.id} exhibitionId={artwork.exhibitionId} />
      {/* <EditArtworkForm artworkId={artwork.id} /> */}
    </div>
  );
}
