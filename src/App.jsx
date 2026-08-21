import { useEffect, useState } from "react";

import { getWikidataArtworks } from "./API/WikidataApi";

export default function App() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 이미지가 실제로 열리는지 검사
  const checkImage = (url) => {
    return new Promise((resolve) => {
      const image = new Image();

      image.src = url;

      image.onload = () => {
        resolve(true);
      };

      image.onerror = () => {
        resolve(false);
      };
    });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getWikidataArtworks();

        const checkedArtworks = [];

        // 앞에서부터 하나씩 이미지 확인
        for (const art of data) {
          // 이미 30개 모았으면 종료
          if (checkedArtworks.length >= 30) {
            break;
          }

          const imageUrl = art.image?.value;

          if (!imageUrl) {
            continue;
          }

          const imageOk = await checkImage(imageUrl);

          // 이미지가 정상적으로 뜨는 작품만 추가
          if (imageOk) {
            checkedArtworks.push(art);
          }
        }

        console.log("최종 사용 가능한 작품:", checkedArtworks);

        setArtworks(checkedArtworks);
      } catch (error) {
        console.log("Wikidata 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <main
      style={{
        padding: "40px",
      }}
    >
      <h1>WIKIDATA ART TEST</h1>

      <p>정상 이미지 작품 : {artworks.length}개</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "30px",
          marginTop: "40px",
        }}
      >
        {artworks.map((art, index) => {
          // 제작연도 정리
          const year = art.date?.value
            ? art.date.value.slice(0, 4)
            : "연도 정보 없음";

          return (
            <div
              key={`${art.artwork.value}-${index}`}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
              }}
            >
              {/* 작품 이미지 */}
              <img
                src={art.image.value}
                alt={art.artworkLabel.value}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "contain",
                }}
              />

              {/* 작품명 */}
              <h2
                style={{
                  marginTop: "20px",
                }}
              >
                {art.artworkLabel.value}
              </h2>

              {/* 작가 */}
              <p>
                <strong>작가 :</strong>{" "}
                {art.creatorLabel?.value || "작가 정보 없음"}
              </p>

              {/* 제작연도 */}
              <p>
                <strong>제작연도 :</strong> {year}
              </p>

              {/* 작품 설명 */}
              <p>
                <strong>설명 :</strong>{" "}
                {art.description?.value || "작품 설명 없음"}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
