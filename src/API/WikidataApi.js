const BASE_URL = "/wikidata-api";

export const getWikidataArtwork = async () => {
  const query = `
    SELECT
      ?artwork
      ?artworkLabel
      ?creatorLabel
      ?image
      ?date
      ?movementLabel
      ?collectionLabel
      ?height
      ?width
      ?placeLabel
      ?description
      (GROUP_CONCAT(DISTINCT ?materialLabel; separator=", ") AS ?materials)
      (GROUP_CONCAT(DISTINCT ?depictsLabel; separator=", ") AS ?depictsList)

    WHERE {

      VALUES ?artwork {
        wd:Q12418
      }

      OPTIONAL {
        ?artwork wdt:P170 ?creator.
      }

      OPTIONAL {
        ?artwork wdt:P18 ?image.
      }

      OPTIONAL {
        ?artwork wdt:P571 ?date.
      }

      OPTIONAL {
        ?artwork wdt:P135 ?movement.
      }

      OPTIONAL {
        ?artwork wdt:P195 ?collection.
      }

      OPTIONAL {
        ?artwork wdt:P186 ?material.
      }

      OPTIONAL {
        ?artwork wdt:P180 ?depicts.
      }

      OPTIONAL {
        ?artwork wdt:P2048 ?height.
      }

      OPTIONAL {
        ?artwork wdt:P2049 ?width.
      }

      OPTIONAL {
        ?artwork wdt:P1071 ?place.
      }

      OPTIONAL {
        ?artwork schema:description ?description.
        FILTER(LANG(?description) = "ko")
      }

      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "ko,en".

        ?artwork rdfs:label ?artworkLabel.
        ?creator rdfs:label ?creatorLabel.
        ?movement rdfs:label ?movementLabel.
        ?collection rdfs:label ?collectionLabel.
        ?material rdfs:label ?materialLabel.
        ?depicts rdfs:label ?depictsLabel.
        ?place rdfs:label ?placeLabel.
      }
    }

    GROUP BY
      ?artwork
      ?artworkLabel
      ?creatorLabel
      ?image
      ?date
      ?movementLabel
      ?collectionLabel
      ?height
      ?width
      ?placeLabel
      ?description
  `;

  const params = new URLSearchParams({
    query,
    format: "json",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Wikidata API 오류: ${response.status}`);
  }

  const data = await response.json();

  console.log("Wikidata 작품 데이터:", data.results.bindings);

  return data.results.bindings;
};
