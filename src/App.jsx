import { useEffect, useState } from "react";
import { getWikidataArtwork } from "./API/WikidataApi";

export default function App() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getWikidataArtwork();

        const uniqueArtworks = data.filter(
          (item, index, array) =>
            index ===
            array.findIndex(
              (artwork) => artwork.artwork?.value === item.artwork?.value,
            ),
        );

        setArtworks(uniqueArtworks);

        if (uniqueArtworks.length > 0) {
          setSelectedArtwork(uniqueArtworks[0]);
        }
      } catch (err) {
        console.error(err);
        setError("작품 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const getYear = (date) => {
    if (!date) return "-";

    return date.slice(0, 4);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE]">
        <p className="text-[15px] text-[#777]">작품을 불러오는 중...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE]">
        <p className="text-[15px] text-red-500">{error}</p>
      </main>
    );
  }

  if (!selectedArtwork) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE]">
        <p>작품이 없습니다.</p>
      </main>
    );
  }

  const artwork = selectedArtwork;

  const title = artwork.artworkLabel?.value || "제목 없음";
  const creator = artwork.creatorLabel?.value || "작가 미상";
  const image = artwork.image?.value;
  const year = getYear(artwork.date?.value);

  const movement = artwork.movementLabel?.value || "-";
  const collection = artwork.collectionLabel?.value || "-";
  const materials = artwork.materials?.value || "-";
  const height = artwork.height?.value;
  const width = artwork.width?.value;
  const place = artwork.placeLabel?.value || "-";
  const depicts = artwork.depictsList?.value || "-";

  const description =
    artwork.wikipediaSummary ||
    artwork.description?.value ||
    "등록된 작품 소개가 없습니다.";

  return (
    <main className="min-h-screen bg-[#F7F4EE] px-5 py-[70px] text-[#292929] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1250px]">
        {/* 작품 선택 */}
        <div className="mb-[50px] flex flex-wrap gap-3">
          {artworks.map((item) => {
            const itemTitle = item.artworkLabel?.value || "제목 없음";

            return (
              <button
                key={item.artwork?.value}
                type="button"
                onClick={() => setSelectedArtwork(item)}
                className={`rounded-full border px-5 py-2 text-[14px] transition ${
                  selectedArtwork.artwork?.value === item.artwork?.value
                    ? "border-[#292929] bg-[#292929] text-white"
                    : "border-[#292929]/20 bg-transparent hover:border-[#292929]"
                }`}
              >
                {itemTitle}
              </button>
            );
          })}
        </div>

        {/* 상단 상세 정보 */}
        <section className="grid gap-[60px] lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* 작품 이미지 */}
          <div className="flex min-h-[500px] items-center justify-center bg-[#EEEAE2] p-8 lg:min-h-[650px]">
            {image ? (
              <img
                src={image}
                alt={title}
                className="max-h-[600px] max-w-full object-contain"
              />
            ) : (
              <p className="text-[14px] text-[#999]">이미지가 없습니다.</p>
            )}
          </div>

          {/* 작품 정보 */}
          <div className="lg:pt-5">
            <p className="mb-3 text-[14px] text-[#8B8177]">ARTWORK</p>

            <h1 className="font-serif text-[42px] leading-[1.2] tracking-[-0.03em] sm:text-[52px]">
              {title}
            </h1>

            <p className="mt-5 text-[18px] text-[#666]">{creator}</p>

            <div className="my-9 h-px bg-[#292929]/15" />

            <dl className="space-y-5 text-[15px]">
              <div className="grid grid-cols-[110px_1fr] gap-5">
                <dt className="text-[#8B8177]">제작연도</dt>
                <dd>{year}</dd>
              </div>

              <div className="grid grid-cols-[110px_1fr] gap-5">
                <dt className="text-[#8B8177]">미술 사조</dt>
                <dd>{movement}</dd>
              </div>

              <div className="grid grid-cols-[110px_1fr] gap-5">
                <dt className="text-[#8B8177]">소장처</dt>
                <dd>{collection}</dd>
              </div>

              <div className="grid grid-cols-[110px_1fr] gap-5">
                <dt className="text-[#8B8177]">재료</dt>
                <dd>{materials}</dd>
              </div>

              <div className="grid grid-cols-[110px_1fr] gap-5">
                <dt className="text-[#8B8177]">크기</dt>

                <dd>{height && width ? `${width} × ${height}` : "-"}</dd>
              </div>

              <div className="grid grid-cols-[110px_1fr] gap-5">
                <dt className="text-[#8B8177]">제작 장소</dt>
                <dd>{place}</dd>
              </div>

              <div className="grid grid-cols-[110px_1fr] gap-5">
                <dt className="text-[#8B8177]">묘사 대상</dt>
                <dd>{depicts}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* 작품 소개 */}
        <section className="mt-[90px] border-t border-[#292929]/15 pt-[50px]">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <h2 className="font-serif text-[30px]">작품 소개</h2>

            <p className="max-w-[850px] whitespace-pre-line text-[17px] leading-[1.9] text-[#55514C]">
              {description}
            </p>
          </div>
        </section>

        {/* API 확인용 */}
        <section className="mt-[80px] border-t border-[#292929]/15 pt-[40px]">
          <p className="mb-4 text-[13px] text-[#8B8177]">
            WIKIDATA / WIKIPEDIA API TEST
          </p>

          <pre className="overflow-x-auto bg-white/50 p-5 text-[12px] leading-[1.7]">
            {JSON.stringify(selectedArtwork, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}
