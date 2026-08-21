const BASE_URL = "/wikidata-api";

export const getWikidataArtworks = async () => {
  const query = `
    SELECT
      ?artwork
      ?artworkLabel
      ?image
      ?creator
      ?creatorLabel
      ?date
      ?description
    WHERE {

      {
        SELECT ?artwork ?artworkLabel ?image WHERE {
          ?artwork wdt:P31 wd:Q3305213.
          ?artwork wdt:P18 ?image.
          ?artwork rdfs:label ?artworkLabel.

          FILTER(LANG(?artworkLabel) = "ko")
        }

        LIMIT 60
      }

      OPTIONAL {
        ?artwork wdt:P170 ?creator.

        OPTIONAL {
          ?creator rdfs:label ?creatorLabel.

          FILTER(LANG(?creatorLabel) = "ko")
        }
      }

      OPTIONAL {
        ?artwork wdt:P571 ?date.
      }

      OPTIONAL {
        ?artwork schema:description ?description.

        FILTER(LANG(?description) = "ko")
      }
    }
  `;

  const params = new URLSearchParams({
    query,
    format: "json",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  console.log("Wikidata 응답 상태:", response.status);

  if (!response.ok) {
    throw new Error(`Wikidata API 오류: ${response.status}`);
  }

  const data = await response.json();

  console.log("Wikidata 작품 데이터:", data.results.bindings);

  return data.results.bindings;
};
