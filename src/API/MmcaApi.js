const BASE_URL = "/mmca-api";

export const getMmcaArtworks = async () => {
  const params = new URLSearchParams({
    numOfRows: "10",
    pageNo: "1",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  console.log("MMCA 응답 상태:", response.status);

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`MMCA API 오류: ${response.status}`);
  }

  try {
    const data = JSON.parse(text);

    console.log("MMCA JSON 데이터:", data);

    // ⭐ 첫 번째 작품만 확인
    console.log("첫 번째 작품:", data?.response?.body?.items?.item?.[0]);

    return data;
  } catch {
    console.log("JSON 변환 실패");

    return text;
  }
};
