const BASE_URL = "/wikidata-api";

const getWikipediaSummary = async (articleUrl) => {
  if (!articleUrl) return "";

  try {
    const title = decodeURIComponent(articleUrl.split("/wiki/")[1]);

    const response = await fetch(
      `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    );

    if (!response.ok) {
      return "";
    }

    const data = await response.json();

    return data.extract || "";
  } catch (error) {
    console.error("Wikipedia API 오류:", error);
    return "";
  }
};

export const getWikidataArtwork = async () => {
  const query = `
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>
    PREFIX schema: <http://schema.org/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

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
      ?article

      (GROUP_CONCAT(DISTINCT ?materialLabel; separator=", ") AS ?materials)
      (GROUP_CONCAT(DISTINCT ?depictsLabel; separator=", ") AS ?depictsList)

    WHERE {

      VALUES ?artwork {
        wd:Q12418
        wd:Q45585
        wd:Q185372
        wd:Q18891156
        wd:Q698487
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

      OPTIONAL {
        ?article schema:about ?artwork;
                 schema:isPartOf <https://ko.wikipedia.org/>.
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
      ?article
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

  const artworks = await Promise.all(
    data.results.bindings.map(async (item) => {
      const wikipediaSummary = item.article?.value
        ? await getWikipediaSummary(item.article.value)
        : "";

      return {
        ...item,
        wikipediaSummary,
      };
    }),
  );

  console.log("작품 데이터:", artworks);

  return artworks;
};
