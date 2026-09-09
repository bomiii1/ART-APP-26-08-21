import { useEffect, useState } from "react";
import { getWikidataArtworks } from "./API/WikidataApi";

export default function App() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getWikidataArtworks();

        const filteredArtworks = data
          .filter((art) => art.image?.value)
          .slice(0, 30);

        setArtworks(filteredArtworks);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main
      style={{
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "40px 24px",
        }}
      >
        {artworks.map((art, index) => {
          const year = art.date?.value
            ? art.date.value.slice(0, 4)
            : "";

          return (
            <div key={`${art.artwork.value}-${index}`}>
              <img
                src={art.image?.value}
                alt={art.artworkLabel?.value || ""}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <h2
                style={{
                  fontSize: "18px",
                  marginTop: "14px",
                  marginBottom: "6px",
                }}
              >
                {art.artworkLabel?.value}
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                {art.creatorLabel?.value || "작가 미상"}
                {year && ` · ${year}`}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}