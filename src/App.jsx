import { useEffect, useState } from "react";
import { getWikidataArtwork } from "./API/WikidataApi";

export default function App() {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const data = await getWikidataArtwork();

        console.log("App에서 받은 데이터:", data);

        setArtwork(data[0]);
      } catch (error) {
        console.error("작품 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, []);

  if (loading) {
    return <p>불러오는 중...</p>;
  }

  if (!artwork) {
    return <p>작품 정보가 없습니다.</p>;
  }

  return (
    <main>
      {artwork.image?.value && (
        <img
          src={artwork.image.value.replace("http://", "https://")}
          alt={artwork.artworkLabel?.value || "작품 이미지"}
          width="500"
        />
      )}

      <h1>{artwork.artworkLabel?.value || "작품명 없음"}</h1>

      <p>작가: {artwork.creatorLabel?.value || "정보 없음"}</p>

      <p>
        제작연도:{" "}
        {artwork.date?.value
          ? new Date(artwork.date.value).getFullYear()
          : "정보 없음"}
      </p>

      <p>미술 사조: {artwork.movementLabel?.value || "정보 없음"}</p>

      <p>소장처: {artwork.collectionLabel?.value || "정보 없음"}</p>

      <p>재료: {artwork.materials?.value || "정보 없음"}</p>

      <p>묘사 대상: {artwork.depictsList?.value || "정보 없음"}</p>

      <p>
        크기:{" "}
        {artwork.width?.value && artwork.height?.value
          ? `${artwork.width.value} × ${artwork.height.value}`
          : "정보 없음"}
      </p>

      <p>제작 장소: {artwork.placeLabel?.value || "정보 없음"}</p>

      <p>설명: {artwork.description?.value || "정보 없음"}</p>
    </main>
  );
}
