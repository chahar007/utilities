import { Helmet } from "react-helmet";

const GameHubHelmet = ({ game }) => {
  const gameTitle = game?.title || "Game Hub - The Ultimate Gaming Destination";
  const gameDescription = game?.description || "Game Hub offers the latest gaming news, trailers, reviews, and system requirements for your favorite games. Join our gaming community now!";
  const gameSlug = game?.slug || "game-hub";
  const gameBannerImage = game?.bannerImage || "default-banner-image.jpg"; // Default image if not available
  const currentUrl = `${window.location.origin}/games/${gameSlug}`;

  return (
    <Helmet>
      {/* Title */}
      <title>{gameTitle} | Game Hub</title>

      {/* Meta Description */}
      <meta
        name="description"
        content={gameDescription}
      />

      {/* Meta Keywords */}
      <meta
        name="keywords"
        content={`gaming, video games, ${gameTitle}, online gaming, ${game?.category?.join(", ")}`}
      />

      {/* Meta Author */}
      <meta name="author" content="Game Hub Team" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={gameTitle} />
      <meta property="og:description" content={gameDescription} />
      <meta property="og:image" content={gameBannerImage} />
      <meta property="og:url" content={currentUrl} />

      {/* Canonical Link */}
      <link rel="canonical" href={currentUrl} />

      {/* JSON-LD Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoGame",
          "name": gameTitle,
          "url": currentUrl,
          "description": gameDescription,
          "image": gameBannerImage,
          "genre": game?.category?.join(", ") || "Video Game",
          "publisher": game?.publisher || "Unknown Publisher",
          "developer": game?.developer || "Unknown Developer",
          "releaseDate": game?.releaseDate || "TBD",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": game?.rating || "4.5",
            "reviewCount": game?.reviewCount || "100"
          },
          "offers": {
            "@type": "Offer",
            "url": currentUrl,
            "priceCurrency": "USD",
            "price": game?.price || "59.99",
            "priceValidUntil": "2025-12-31"
          }
        })}
      </script>
    </Helmet>
  );
};

export default GameHubHelmet;
