import { useEffect, useState } from "react";
import { getWikidataArtwork } from "./API/WikidataApi";

export default function App() {
  const [artworks, setArtworks] = useState([]);
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

        setArtworks(uniqueArtworks.slice(0, 5));
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
    if (!date) return "";

    return date.slice(0, 4);
  };

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#292929]">
      {/* HEADER */}
      <header className="mx-auto flex h-[90px] w-full max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <h1 className="font-serif text-[26px] tracking-[-0.02em]">ARTORY</h1>

        <nav className="hidden items-center gap-8 text-[15px] md:flex">
          <a
            href="#gallery"
            className="transition-opacity duration-300 hover:opacity-50"
          >
            작품찾기
          </a>

          <a
            href="#gallery"
            className="transition-opacity duration-300 hover:opacity-50"
          >
            작가
          </a>

          <a
            href="#about"
            className="transition-opacity duration-300 hover:opacity-50"
          >
            소개
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto w-full max-w-[1400px] px-5 pb-[100px] pt-[80px] sm:px-8 lg:px-12 lg:pb-[130px] lg:pt-[110px]">
        <p className="mb-4 text-[13px] tracking-[0.2em] text-[#702D3B]">
          ONLINE ART GALLERY
        </p>

        <h2 className="font-serif text-[54px] leading-[0.95] tracking-[-0.03em] sm:text-[70px] lg:text-[88px]">
          Art,
          <br />
          beyond the frame.
        </h2>

        <p className="mt-8 text-[16px] leading-[1.8] text-[#6F6A63]">
          일상 속에서 다양한 작품을 발견하고
          <br />
          자유롭게 감상해보세요.
        </p>

        <a
          href="#gallery"
          className="mt-8 inline-flex items-center gap-3 text-[15px] transition-opacity duration-300 hover:opacity-50"
        >
          Explore
          <span>→</span>
        </a>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="border-t border-[#292929]/10 py-[90px] lg:py-[110px]"
      >
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
          {/* TITLE */}
          <div className="mb-[60px] flex items-end justify-between">
            <div>
              <p className="mb-2 text-[14px] text-[#702D3B]">01</p>

              <h2 className="font-serif text-[46px] sm:text-[58px]">Gallery</h2>
            </div>

            <button
              type="button"
              className="hidden text-[14px] transition-opacity hover:opacity-50 md:block"
            >
              전체 작품 보기 →
            </button>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex h-[250px] items-center justify-center">
              <p className="text-[15px] text-[#8D877D]">
                작품을 불러오는 중...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="flex h-[250px] items-center justify-center">
              <p className="text-[15px] text-[#702D3B]">{error}</p>
            </div>
          )}

          {/* ARTWORK LIST */}
          {!loading && !error && (
            <div className="flex flex-wrap justify-center gap-x-[45px] gap-y-[60px] lg:justify-between">
              {artworks.map((artwork) => {
                const image = artwork.image?.value;

                const title = artwork.artworkLabel?.value || "제목 없음";

                const creator = artwork.creatorLabel?.value || "작가 미상";

                const year = getYear(artwork.date?.value);

                return (
                  <article
                    key={artwork.artwork?.value}
                    className="w-[150px] sm:w-[165px] lg:w-[180px]"
                  >
                    {/* IMAGE BOX */}
                    <div
                      style={{
                        width: "180px",
                        maxWidth: "100%",
                        height: "220px",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        overflow: "hidden",
                        margin: "0 auto",
                      }}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          style={{
                            display: "block",
                            width: "auto",
                            height: "auto",
                            maxWidth: "180px",
                            maxHeight: "220px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <div className="flex h-[200px] w-[160px] items-center justify-center bg-[#E8E1D6]">
                          <span className="text-[12px] text-[#8D877D]">
                            이미지 없음
                          </span>
                        </div>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="mt-5">
                      <h3 className="font-serif text-[17px] leading-[1.4]">
                        {title}
                      </h3>

                      <p className="mt-2 text-[13px] leading-[1.5] text-[#6F6A63]">
                        {creator}
                      </p>

                      {year && (
                        <p className="mt-1 text-[12px] text-[#9B958B]">
                          {year}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <button type="button" className="mt-12 text-[14px] md:hidden">
            전체 작품 보기 →
          </button>
        </div>
      </section>

      {/* FEATURED */}
      <section className="border-t border-[#292929]/10 py-[100px] lg:py-[130px]">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-[50px] lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-[14px] text-[#702D3B]">02</p>

              <h2 className="font-serif text-[46px] leading-[1] sm:text-[58px]">
                Featured
                <br />
                Artwork
              </h2>

              <p className="mt-7 max-w-[400px] text-[15px] leading-[1.8] text-[#6F6A63]">
                오늘의 작품 한 점을 천천히 감상해보세요. 작품의 색감과 분위기를
                여유롭게 살펴볼 수 있습니다.
              </p>

              <button type="button" className="mt-8 text-[14px]">
                작품 자세히 보기 →
              </button>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="flex h-[350px] w-full max-w-[500px] items-center justify-center bg-[#E8E1D6]">
                <p className="text-[14px] text-[#8D877D]">Featured Artwork</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVER */}
      <section className="border-t border-[#292929]/10 py-[100px] lg:py-[130px]">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[14px] text-[#702D3B]">03</p>

              <h2 className="font-serif text-[46px] sm:text-[58px]">
                Discover Art
              </h2>
            </div>

            <p className="text-[14px] text-[#8D877D]">
              다양한 방법으로 작품을 만나보세요.
            </p>
          </div>

          <div className="mt-[60px] grid grid-cols-2 gap-[15px] lg:grid-cols-4">
            <button
              type="button"
              className="min-h-[150px] bg-[#EEE8DE] p-6 text-left transition hover:bg-[#E7DFD3]"
            >
              <p className="font-serif text-[25px]">Artist</p>

              <p className="mt-2 text-[13px] text-[#8D877D]">작가로 보기</p>
            </button>

            <button
              type="button"
              className="min-h-[150px] bg-[#EEE8DE] p-6 text-left transition hover:bg-[#E7DFD3]"
            >
              <p className="font-serif text-[25px]">Period</p>

              <p className="mt-2 text-[13px] text-[#8D877D]">시대별 보기</p>
            </button>

            <button
              type="button"
              className="min-h-[150px] bg-[#EEE8DE] p-6 text-left transition hover:bg-[#E7DFD3]"
            >
              <p className="font-serif text-[25px]">Movement</p>

              <p className="mt-2 text-[13px] text-[#8D877D]">
                미술 사조로 보기
              </p>
            </button>

            <button
              type="button"
              className="min-h-[150px] bg-[#EEE8DE] p-6 text-left transition hover:bg-[#E7DFD3]"
            >
              <p className="font-serif text-[25px]">Random</p>

              <p className="mt-2 text-[13px] text-[#8D877D]">랜덤 작품 감상</p>
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#292929]/10 py-[120px] lg:py-[150px]">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <p className="mb-4 text-[13px] tracking-[0.2em] text-[#702D3B]">
            EXPLORE ART
          </p>

          <h2 className="font-serif text-[48px] leading-[1] sm:text-[64px] lg:text-[76px]">
            Find your
            <br />
            favorite artwork.
          </h2>

          <p className="mt-7 text-[15px] text-[#6F6A63]">
            지금, 당신의 취향을 발견해보세요.
          </p>

          <a
            href="#gallery"
            className="mt-8 inline-flex items-center gap-3 text-[15px]"
          >
            작품 둘러보기
            <span>→</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#292929]/10 py-8">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-5 text-[12px] text-[#8D877D] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p className="font-serif text-[18px] text-[#292929]">ARTORY</p>

          <p>Online Art Gallery</p>
        </div>
      </footer>
    </main>
  );
}
