export default function Home() {
  return (
    <main>
      <header className="py-8 text-center" role="banner">
        <h1 className="text-4xl font-bold">Art Nest</h1>
        <p className="text-lg mt-2">Explore art and manage art exhibitions.</p>
      </header>

      <section
        className="px-6 py-8"
        aria-labelledby="intro-heading"
        role="region"
      >
        <h2 id="intro-heading" className="sr-only">
          Introduction
        </h2>
        <p className="text-xl text-center">
          Art Nest is a platform designed to empower users to populate
          exhibition collections they create with artworks they love!
        </p>
      </section>

      <section
        className="px-6 py-8"
        aria-labelledby="features-heading"
        role="region"
      >
        <h2
          id="features-heading"
          className="text-2xl font-semibold text-center mb-4"
        >
          Key Features
        </h2>
        <ul className="space-y-2 text-lg text-center list-none">
          <li>
            Browse and discover a variety of artworks from a variety of sources.
          </li>
          <li>View detailed information about individual artworks.</li>
          <li>
            Registered users can manage their own artwork collections, labeled
            as exhibitions.
          </li>
          <li>Add artworks from external sources to exhibitions.</li>
        </ul>
      </section>
    </main>
  );
}
