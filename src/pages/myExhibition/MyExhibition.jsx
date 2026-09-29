import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Plus } from "lucide-react";

import FrameImg from "../../img/frame.png";
import { getArtworkDetail } from "../../API/WikidataApi";
import PageTitle from "../../components/PageTitle";

const splitValues = (value) => {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getMostFrequent = (values) => {
  if (!values.length) return null;

  const countMap = {};

  values.forEach((value) => {
    countMap[value] = (countMap[value] || 0) + 1;
  });

  return Object.entries(countMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
};

function ArtworkFrame({ artwork }) {
  return (
    <Link
      to={`/artwork/${artwork.id}`}
      className="group flex w-full items-center justify-center"
    >
      <div className="relative w-full">
        <div className="absolute bottom-[12%] left-[12%] right-[12%] top-[11%] overflow-hidden bg-[#191616]">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <img
          src={FrameImg}
          alt=""
          className="pointer-events-none relative z-10 block w-full"
        />
      </div>
    </Link>
  );
}

export default function MyExhibition() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExhibition = async () => {
      try {
        const saved = JSON.parse(localStorage.getItem("myExhibition") || "[]");

        if (!saved.length) {
          setArtworks([]);
          return;
        }

        const completedArtworks = await Promise.all(
          saved.map(async (artwork) => {
            if (
              artwork.movement ||
              artwork.materials ||
              artwork.depicts ||
              artwork.collection
            ) {
              return artwork;
            }

            try {
              const detail = await getArtworkDetail(artwork.id);

              if (!detail) return artwork;

              return {
                ...artwork,
                ...detail,
              };
            } catch (error) {
              console.error(error);
              return artwork;
            }
          }),
        );

        const validArtworks = completedArtworks.filter(
          (artwork) => artwork?.id && artwork?.image,
        );

        setArtworks(validArtworks);

        localStorage.setItem("myExhibition", JSON.stringify(validArtworks));
      } catch (error) {
        console.error(error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    loadExhibition();
  }, []);

  const report = useMemo(() => {
    if (!artworks.length) return [];

    const creators = artworks
      .map((artwork) => artwork.creator)
      .filter(
        (creator) =>
          creator && creator !== "작가 미상" && creator !== "정보 없음",
      );

    const movements = artworks.flatMap((artwork) =>
      splitValues(artwork.movement),
    );

    const materials = artworks.flatMap((artwork) =>
      splitValues(artwork.materials),
    );

    const depicts = artworks.flatMap((artwork) => splitValues(artwork.depicts));

    const favoriteCreator = getMostFrequent(creators);
    const favoriteMovement = getMostFrequent(movements);
    const favoriteMaterial = getMostFrequent(materials);
    const favoriteDepict = getMostFrequent(depicts);

    const result = [];

    if (favoriteMaterial) {
      result.push(
        <>
          <strong>{favoriteMaterial}</strong>을 재료로 사용한 작품을 좋아해요.
        </>,
      );
    }

    if (favoriteCreator) {
      result.push(
        <>
          <strong>{favoriteCreator}</strong>의 작품을 좋아해요.
        </>,
      );
    }

    if (favoriteMovement) {
      result.push(
        <>
          <strong>{favoriteMovement}</strong> 작품을 좋아해요.
        </>,
      );
    }

    if (favoriteDepict) {
      result.push(
        <>
          <strong>{favoriteDepict}</strong>을 그린 작품을 좋아해요.
        </>,
      );
    }

    return result.slice(0, 4);
  }, [artworks]);

  const artworkGridClass =
    artworks.length === 1
      ? "max-w-[470px] grid-cols-1"
      : artworks.length === 2
        ? "max-w-[900px] grid-cols-2"
        : "max-w-[1260px] grid-cols-2 md:grid-cols-3";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#211d1e] pt-[80px]">
        <p className="text-[14px] text-white/40 sm:text-[16px]">
          내 전시를 불러오는 중입니다...
        </p>
      </main>
    );
  }

  return (
    <>
      <PageTitle title={"MY EXHIBITION"} />
      <main className="min-h-screen bg-[#211d1e] pt-[80px] text-[#fafafa]">
        <section className="bg-[#d4cdca] px-[16px] py-[45px] text-[#3c3c3c] sm:px-[40px] sm:py-[55px] md:px-[60px] lg:px-[150px] lg:py-[60px]">
          <div className="flex flex-col gap-[30px] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-['Forum'] text-[38px] leading-none text-[#7A2431] sm:text-[48px] lg:text-[52px]">
                MY EXHIBITION
              </h1>

              <p className="mt-[10px] text-[16px] text-[#3c3c3c]/65 sm:text-[17px] lg:text-[18px]">
                내가 좋아하는 작품들을 모았어요.
              </p>
            </div>

            <Link
              to="/viewing"
              state={{
                source: "myExhibition",
                title: "My Exhibition",
              }}
              className="flex w-fit items-center gap-[24px] self-end rounded-[4px] bg-[#3c3c3c]/20 px-[22px] py-[14px] text-[16px] text-white transition-all duration-300 hover:bg-[#3c3c3c]/30 sm:self-auto lg:px-[28px] lg:py-[16px] lg:text-[18px]"
            >
              전체 감상
              <Play size={20} strokeWidth={1.2} />
            </Link>
          </div>
        </section>

        <section className="px-[16px] py-[55px] sm:px-[30px] sm:py-[70px] md:px-[40px] lg:px-[70px] lg:py-[80px]">
          {artworks.length > 0 ? (
            <>
              <div className="mx-auto max-w-[1260px]">
                <p className="text-center text-[15px] text-white/60 sm:text-left sm:text-[17px] lg:text-[20px]">
                  지금까지 마음에 드는 작품{" "}
                  <span className="font-medium text-[#9e2638]">
                    {artworks.length}개
                  </span>
                  를 담았어요
                </p>
              </div>

              <div
                className={`mx-auto mt-[30px] grid items-center justify-items-center gap-x-[4px] gap-y-[12px] sm:gap-x-[6px] sm:gap-y-[14px] md:gap-x-[8px] md:gap-y-[16px] lg:gap-x-[10px] lg:gap-y-[18px] ${artworkGridClass}`}
              >
                {artworks.map((artwork) => (
                  <ArtworkFrame key={artwork.id} artwork={artwork} />
                ))}
              </div>

              <div className="mt-[45px] flex justify-center sm:mt-[55px]">
                <Link
                  to="/search"
                  className="flex w-full max-w-[350px] items-center justify-center gap-[22px] rounded-[8px] bg-white/[0.07] px-[30px] py-[20px] text-[15px] text-white/85 transition-all duration-300 hover:bg-white/[0.12] sm:text-[17px] lg:max-w-[420px] lg:py-[22px]"
                >
                  작품 더 담으러 가기
                  <Plus size={20} strokeWidth={1.2} />
                </Link>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <p className="text-[16px] text-white/50 sm:text-[18px]">
                아직 담아둔 작품이 없어요.
              </p>

              <Link
                to="/search"
                className="mt-[25px] flex items-center gap-[12px] rounded-[6px] bg-white/10 px-[25px] py-[14px] text-[15px] text-white/80 transition-colors duration-300 hover:bg-white/15"
              >
                작품 둘러보기
                <Plus size={18} strokeWidth={1.2} />
              </Link>
            </div>
          )}
        </section>

        {artworks.length > 0 && (
          <section className="px-[16px] pb-[100px] pt-[10px] sm:px-[30px] sm:pb-[120px] md:px-[40px] lg:px-[70px] lg:pb-[130px]">
            <div className="mx-auto max-w-[1260px]">
              <h2 className="font-['Forum'] text-[44px] leading-none sm:text-[50px] lg:text-[52px]">
                MY REPORT
              </h2>

              <p className="mt-[10px] max-w-[600px] text-[14px] leading-[1.5] text-white/45 sm:text-[16px] lg:text-[18px]">
                마음에 드는 새로운 작품을 빠르게 탐색할 수 있도록 취향을
                분석해봤어요
              </p>

              {report.length > 0 ? (
                <div className="mt-[30px] flex flex-wrap gap-[10px] sm:mt-[35px]">
                  {report.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-[5px] bg-white/10 px-[14px] py-[10px] text-[14px] leading-[1.5] text-white/65 sm:px-[16px] sm:text-[15px] lg:text-[16px] [&_strong]:font-normal [&_strong]:text-[#CEB68F]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-[30px] text-[14px] text-white/35 sm:text-[15px]">
                  작품을 조금 더 담으면 취향을 분석해드릴 수 있어요.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
