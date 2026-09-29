const BASE_URL = "https://query.wikidata.org/sparql";

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

export const searchWikidataArtworks = async (keyword, limit = 12) => {
  if (!keyword?.trim()) return [];

  const aliases = {
    고흐: "Vincent van Gogh",
    모네: "Claude Monet",
    르누아르: "Pierre-Auguste Renoir",
    클림트: "Gustav Klimt",
    드가: "Edgar Degas",
    뭉크: "Edvard Munch",
    세잔: "Paul Cézanne",
    고갱: "Paul Gauguin",
    마네: "Édouard Manet",
    달리: "Salvador Dalí",
    칸딘스키: "Wassily Kandinsky",
    페르메이르: "Johannes Vermeer",

    진주귀걸이를한소녀: "Girl with a Pearl Earring",
    "진주 귀걸이를 한 소녀": "Girl with a Pearl Earring",
    별이빛나는밤: "The Starry Night",
    "별이 빛나는 밤": "The Starry Night",
  };

  const originalKeyword = keyword.trim();
  const normalizedKeyword = originalKeyword.replace(/\s/g, "");

  const searchKeyword =
    aliases[originalKeyword] || aliases[normalizedKeyword] || originalKeyword;

  try {
    const searchParams = new URLSearchParams({
      action: "wbsearchentities",
      search: searchKeyword,
      language: "en",
      uselang: "ko",
      format: "json",
      origin: "*",
      limit: "3",
    });

    const searchResponse = await fetch(
      `https://www.wikidata.org/w/api.php?${searchParams.toString()}`,
    );

    if (!searchResponse.ok) {
      throw new Error("검색에 실패했습니다.");
    }

    const searchData = await searchResponse.json();

    const ids = (searchData.search || [])
      .map((item) => item.id)
      .filter((id) => /^Q\d+$/.test(id));

    if (!ids.length) return [];

    const entityParams = new URLSearchParams({
      action: "wbgetentities",
      ids: ids.join("|"),
      props: "labels|claims",
      languages: "ko|en",
      format: "json",
      origin: "*",
    });

    const entityResponse = await fetch(
      `https://www.wikidata.org/w/api.php?${entityParams.toString()}`,
    );

    if (!entityResponse.ok) {
      throw new Error("검색 정보를 확인하지 못했습니다.");
    }

    const entityData = await entityResponse.json();

    const entities = ids.map((id) => entityData.entities?.[id]).filter(Boolean);

    const artworkEntity = entities.find((entity) => {
      return entity.claims?.P18?.length && entity.claims?.P170?.length;
    });

    if (artworkEntity) {
      const filename =
        artworkEntity.claims.P18?.[0]?.mainsnak?.datavalue?.value;

      const creatorId =
        artworkEntity.claims.P170?.[0]?.mainsnak?.datavalue?.value?.id;

      let creator = "작가 미상";

      if (creatorId) {
        const creatorParams = new URLSearchParams({
          action: "wbgetentities",
          ids: creatorId,
          props: "labels",
          languages: "ko|en",
          format: "json",
          origin: "*",
        });

        const creatorResponse = await fetch(
          `https://www.wikidata.org/w/api.php?${creatorParams.toString()}`,
        );

        if (creatorResponse.ok) {
          const creatorData = await creatorResponse.json();

          const creatorEntity = creatorData.entities?.[creatorId];

          creator =
            creatorEntity?.labels?.ko?.value ||
            creatorEntity?.labels?.en?.value ||
            "작가 미상";
        }
      }

      return [
        {
          id: artworkEntity.id,
          title:
            artworkEntity.labels?.ko?.value ||
            artworkEntity.labels?.en?.value ||
            "제목 없음",
          creator,
          image: filename
            ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
                filename,
              )}`
            : "",
          date: "",
        },
      ];
    }

    const creatorEntity = entities.find((entity) => {
      const instanceOf =
        entity.claims?.P31?.[0]?.mainsnak?.datavalue?.value?.id;

      return instanceOf === "Q5";
    });

    if (!creatorEntity) {
      return [];
    }

    const creatorId = creatorEntity.id;

    const creatorName =
      creatorEntity.labels?.ko?.value ||
      creatorEntity.labels?.en?.value ||
      "작가 미상";

    const query = `
      PREFIX wd: <http://www.wikidata.org/entity/>
      PREFIX wdt: <http://www.wikidata.org/prop/direct/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT
        ?artwork
        ?titleKo
        ?titleEn
        ?image
        ?date

      WHERE {
        ?artwork wdt:P170 wd:${creatorId};
                 wdt:P18 ?image.

        OPTIONAL {
          ?artwork wdt:P571 ?date.
        }

        OPTIONAL {
          ?artwork rdfs:label ?titleKo.
          FILTER(LANG(?titleKo) = "ko")
        }

        OPTIONAL {
          ?artwork rdfs:label ?titleEn.
          FILTER(LANG(?titleEn) = "en")
        }
      }

      LIMIT ${limit}
    `;

    const params = new URLSearchParams({
      query,
      format: "json",
    });

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 6000);

    try {
      const response = await fetch(`${BASE_URL}?${params.toString()}`, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error("작품을 불러오지 못했습니다.");
      }

      const data = await response.json();

      return data.results.bindings.map((item) => ({
        id: item.artwork.value.split("/").pop(),
        title: item.titleKo?.value || item.titleEn?.value || "제목 없음",
        creator: creatorName,
        image: item.image?.value || "",
        date: item.date?.value || "",
      }));
    } catch (error) {
      clearTimeout(timeout);

      if (error.name === "AbortError") {
        throw new Error("검색 시간이 너무 오래 걸립니다.");
      }

      throw error;
    }
  } catch (error) {
    console.error("검색 오류:", error);
    throw error;
  }
};

export const getArtworkDetail = async (id) => {
  const query = `
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>
    PREFIX schema: <http://schema.org/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

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
      ?article
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

      OPTIONAL {
        ?article schema:about ?artwork;
                 schema:isPartOf <https://ko.wikipedia.org/>.
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
      ?article
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

  const wikipediaSummary = item.article?.value
    ? await getWikipediaSummary(item.article.value)
    : "";

  return {
    id,
    title: item.titleKo?.value || item.titleEn?.value || "제목 없음",
    titleEn: item.titleEn?.value || "",
    description: wikipediaSummary || item.descriptionKo?.value || "",
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
