const BASE_URL = "https://api.europeana.eu/record/v2/search.json";

const API_KEY = import.meta.env.VITE_EUROPEANA_API_KEY;

export const getEuropeanaArtworks = async () => {
  const params = new URLSearchParams({
    wskey: API_KEY,
    query: "painting",
    theme: "art",
    media: "true",
    thumbnail: "true",
    reusability: "open",
    rows: "10",
    profile: "rich",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Europeana API 오류: ${response.status}`);
  }

  const data = await response.json();

  console.log("Europeana 전체 데이터:", data);
  console.log("첫 번째 작품:", data.items?.[0]);

  return data;
};
