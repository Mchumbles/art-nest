import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExhibitionPageProps } from "@/types/exhibitions";
import DeleteExhibitionButton from "@/components/DeleteExhibitionButton";
import EditExhibitionForm from "@/components/EditExhibitionForm";
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
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" id="exhibition-title">
          Exhibition: {exhibition.title}
        </h1>
        <DeleteExhibitionButton id={exhibition.id} />
      </header>

      <section
        aria-labelledby="exhibition-title"
        className="text-xl mb-6 space-y-1"
      >
        <p>
          <strong>Category:</strong> {exhibition.category}
        </p>
        {exhibition.location && (
          <p>
            <strong>Location:</strong> {exhibition.location}
          </p>
        )}
      </section>

      {/* <CreateArtworkForm exhibitionId={id} /> */}

      <section>
        <h2 className="text-3xl mt-8 mb-4 font-semibold" id="artworks-heading">
          Artworks
        </h2>

        {exhibition.artworks.length > 0 ? (
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            aria-labelledby="artworks-heading"
          >
            {exhibition.artworks.map((artwork) =>
              artwork.id ? (
                <li
                  key={artwork.id}
                  className="overflow-hidden"
                  role="listitem"
                >
                  <Link
                    href={`/userArtworks/${artwork.id}`}
                    aria-label={`View details of ${
                      artwork.title || "Untitled"
                    }`}
                  >
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
          <p className="text-lg" role="status">
            No artworks yet for this exhibition.
          </p>
        )}
      </section>

      <section aria-labelledby="edit-exhibition-heading">
        <h2
          id="edit-exhibition-heading"
          className="text-3xl mt-8 mb-4 font-semibold text-center"
        >
          Edit Exhibition
        </h2>
        <EditExhibitionForm exhibitionId={exhibition.id} />
      </section>
    </div>
  );
}
