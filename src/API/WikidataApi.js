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
    console.error(error);
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
    throw new Error(response.status);
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

  console.log(artworks);

  return artworks;
};

export const getGalleryArtworks = async () => {
  const query = `
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT
      ?artwork
      ?artworkLabel
      ?image

    WHERE {
      ?artwork wdt:P31 wd:Q3305213;
               wdt:P18 ?image;
               rdfs:label ?artworkLabel.

      FILTER(LANG(?artworkLabel) = "ko")
    }

    LIMIT 30
  `;

  const params = new URLSearchParams({
    query,
    format: "json",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`API 오류: ${response.status}`);
  }

  const data = await response.json();

  const artworks = data.results.bindings.map((item) => {
    const image = item.image?.value || "";

    return {
      id: item.artwork.value.split("/").pop(),
      title: item.artworkLabel?.value || "제목 없음",
      image: image ? `${image}${image.includes("?") ? "&" : "?"}width=700` : "",
    };
  });

  return [...artworks].sort(() => Math.random() - 0.5).slice(0, 10);
};

// 오늘 추천

export const getTodayPickArtwork = async () => {
  const query = `
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT
      ?artwork
      ?artworkLabel
      ?image
      ?creatorLabel
      ?date
      ?height
      ?width

    WHERE {
      ?artwork wdt:P31 wd:Q3305213;
               wdt:P18 ?image;
               rdfs:label ?artworkLabel.

      FILTER(LANG(?artworkLabel) = "ko")

      OPTIONAL {
        ?artwork wdt:P170 ?creator.
        ?creator rdfs:label ?creatorLabel.
        FILTER(LANG(?creatorLabel) = "ko")
      }

      OPTIONAL {
        ?artwork wdt:P571 ?date.
      }

      OPTIONAL {
        ?artwork wdt:P2048 ?height.
      }

      OPTIONAL {
        ?artwork wdt:P2049 ?width.
      }
    }

    LIMIT 50
  `;

  const params = new URLSearchParams({
    query,
    format: "json",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`API 오류: ${response.status}`);
  }

  const data = await response.json();

  const artworks = data.results.bindings.map((item) => ({
    id: item.artwork.value.split("/").pop(),
    title: item.artworkLabel?.value || "제목 없음",
    creator: item.creatorLabel?.value || "작가 미상",
    image: item.image?.value || "",
    date: item.date?.value || "",
    height: item.height?.value || "",
    width: item.width?.value || "",
  }));

  const today = new Date();

  const dateKey =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const index = (dateKey + 5) % artworks.length;

  return artworks[index];
};

// 큐레이션 목록
export const getCurationArtworks = async (property, value, limit = 50) => {
  const query = `
    SELECT DISTINCT
      ?artwork
      ?artworkLabel
      ?creatorLabel
      ?image
      ?date
    WHERE {
      ?artwork wdt:P31 wd:Q3305213.
      ?artwork wdt:${property} wd:${value}.
      ?artwork wdt:P18 ?image.

      OPTIONAL {
        ?artwork wdt:P170 ?creator.
      }

      OPTIONAL {
        ?artwork wdt:P571 ?date.
      }

      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "ko,en".
      }
    }

    LIMIT ${limit}
  `;

  const params = new URLSearchParams({
    query,
    format: "json",
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error("큐레이션 작품을 불러오지 못했습니다.");
  }

  const data = await response.json();

  const artworks = data.results.bindings.map((item) => ({
    id: item.artwork.value.split("/").pop(),
    title: item.artworkLabel?.value || "",
    creator: item.creatorLabel?.value || "",
    image: item.image?.value || "",
    date: item.date?.value || "",
  }));

  return Array.from(
    new Map(artworks.map((artwork) => [artwork.id, artwork])).values(),
  );
};

//검색

export const searchWikidataArtworks = async (keyword, limit = 20) => {
  const safeKeyword = keyword.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  const query = `
    SELECT DISTINCT
      ?artwork
      ?artworkLabel
      ?creatorLabel
      ?image
      ?date
    WHERE {
      SERVICE wikibase:mwapi {
        bd:serviceParam
          wikibase:endpoint "www.wikidata.org";
          wikibase:api "EntitySearch";
          mwapi:search "${safeKeyword}";
          mwapi:language "ko";
          mwapi:limit "10".

        ?matchedItem wikibase:apiOutputItem mwapi:item.
      }

      {
        BIND(?matchedItem AS ?artwork)

        ?artwork wdt:P31/wdt:P279* wd:Q3305213.
        ?artwork wdt:P18 ?image.

        OPTIONAL {
          ?artwork wdt:P170 ?creator.
        }

        OPTIONAL {
          ?artwork wdt:P571 ?date.
        }
      }

      UNION

      {
        ?artwork wdt:P170 ?matchedItem.
        ?artwork wdt:P31/wdt:P279* wd:Q3305213.
        ?artwork wdt:P18 ?image.

        OPTIONAL {
          ?artwork wdt:P170 ?creator.
        }

        OPTIONAL {
          ?artwork wdt:P571 ?date.
        }
      }

      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "ko,en".

        ?artwork rdfs:label ?artworkLabel.
        ?creator rdfs:label ?creatorLabel.
      }
    }

    LIMIT ${limit}
  `;

  const params = new URLSearchParams({
    query,
    format: "json",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("검색 결과를 불러오지 못했습니다.");
  }

  const data = await response.json();

  const results = data.results.bindings.map((item) => ({
    id: item.artwork.value.split("/").pop(),
    title: item.artworkLabel?.value || "제목 없음",
    creator: item.creatorLabel?.value || "작가 미상",
    image: item.image?.value || "",
    date: item.date?.value || "",
  }));

  const uniqueResults = Array.from(
    new Map(results.map((item) => [item.id, item])).values(),
  );

  return uniqueResults;
};

export const getArtworkDetail = async (id) => {
  const query = `
    SELECT
      ?artwork
      ?titleKo
      ?titleEn
      ?descriptionKo
      ?creatorLabel
      ?image
      ?date
      ?movementLabel
      ?collectionLabel
      ?height
      ?width
      ?placeLabel
      (GROUP_CONCAT(DISTINCT ?materialLabel; separator=", ") AS ?materials)
      (GROUP_CONCAT(DISTINCT ?depictsLabel; separator=", ") AS ?depicts)
    WHERE {
      VALUES ?artwork {
        wd:${id}
      }

      OPTIONAL {
        ?artwork rdfs:label ?titleKo.
        FILTER(LANG(?titleKo) = "ko")
      }

      OPTIONAL {
        ?artwork rdfs:label ?titleEn.
        FILTER(LANG(?titleEn) = "en")
      }

      OPTIONAL {
        ?artwork schema:description ?descriptionKo.
        FILTER(LANG(?descriptionKo) = "ko")
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
        ?artwork wdt:P2048 ?height.
      }

      OPTIONAL {
        ?artwork wdt:P2049 ?width.
      }

      OPTIONAL {
        ?artwork wdt:P276 ?place.
      }

      OPTIONAL {
        ?artwork wdt:P186 ?material.
      }

      OPTIONAL {
        ?artwork wdt:P180 ?depict.
      }

      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "ko,en".

        ?creator rdfs:label ?creatorLabel.
        ?movement rdfs:label ?movementLabel.
        ?collection rdfs:label ?collectionLabel.
        ?place rdfs:label ?placeLabel.
        ?material rdfs:label ?materialLabel.
        ?depict rdfs:label ?depictsLabel.
      }
    }

    GROUP BY
      ?artwork
      ?titleKo
      ?titleEn
      ?descriptionKo
      ?creatorLabel
      ?image
      ?date
      ?movementLabel
      ?collectionLabel
      ?height
      ?width
      ?placeLabel
  `;

  const params = new URLSearchParams({
    query,
    format: "json",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("작품 정보를 불러오지 못했습니다.");
  }

  const data = await response.json();
  const item = data.results.bindings[0];

  if (!item) return null;

  return {
    id,
    title: item.titleKo?.value || item.titleEn?.value || "제목 없음",
    titleEn: item.titleEn?.value || "",
    description: item.descriptionKo?.value || "",
    creator: item.creatorLabel?.value || "작가 미상",
    image: item.image?.value || "",
    date: item.date?.value || "",
    movement: item.movementLabel?.value || "",
    collection: item.collectionLabel?.value || "",
    height: item.height?.value || "",
    width: item.width?.value || "",
    place: item.placeLabel?.value || "",
    materials: item.materials?.value || "",
    depicts: item.depicts?.value || "",
  };
};
