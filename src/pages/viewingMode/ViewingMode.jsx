import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getArtworkDetail } from "../../API/WikidataApi";

export default function ViewingMode() {
  const navigate = useNavigate();
  const location = useLocation();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [speed, setSpeed] = useState(10);
  const [hideInfo, setHideInfo] = useState(false);

  const source = location.state?.source;

  const sourceTitle =
    location.state?.title ||
    (source === "myExhibition" ? "MY EXHIBITION" : "작품 감상");

  const sourceLabel =
    source === "curation"
      ? location.state?.categoryLabel
        ? `큐레이션 > ${location.state.categoryLabel}`
        : "큐레이션"
      : "감상모드";

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        setLoading(true);

        let sourceArtworks = [];

        if (source === "curation") {
          sourceArtworks = Array.isArray(location.state?.artworks)
            ? location.state.artworks
            : [];
        }

        if (source === "myExhibition") {
          sourceArtworks = JSON.parse(
            localStorage.getItem("myExhibition") || "[]",
          );
        }

        if (!sourceArtworks.length) {
          setArtworks([]);
          return;
        }

        const completed = await Promise.all(
          sourceArtworks.map(async (artwork) => {
            if (
              artwork.date ||
              artwork.width ||
              artwork.height ||
              artwork.materials ||
              artwork.movement
            ) {
              return artwork;
            }

            try {
              const detail = await getArtworkDetail(artwork.id);

              return detail
                ? {
                    ...artwork,
                    ...detail,
                  }
                : artwork;
            } catch (error) {
              console.error(error);
              return artwork;
            }
          }),
        );

        const validArtworks = completed.filter(
          (artwork) => artwork?.id && artwork?.image,
        );

        setArtworks(validArtworks);
      } catch (error) {
        console.error(error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, [source, location.state]);

  useEffect(() => {
    if (
      screen !== "viewing" ||
      !autoplay ||
      menuOpen ||
      artworks.length === 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= artworks.length - 1) {
          setScreen("end");
          return prev;
        }

        return prev + 1;
      });
    }, speed * 1000);

    return () => clearInterval(timer);
  }, [screen, autoplay, menuOpen, speed, artworks.length, currentIndex]);

  const currentArtwork = artworks[currentIndex];

  const year = currentArtwork?.date
    ? new Date(currentArtwork.date).getFullYear()
    : "-";

  const size =
    currentArtwork?.width && currentArtwork?.height
      ? `${Number(currentArtwork.width).toFixed(1)} × ${Number(
          currentArtwork.height,
        ).toFixed(1)} cm`
      : "-";

  const expectedTime = useMemo(() => {
    if (!autoplay || !artworks.length) return "-";

    const totalSeconds = artworks.length * speed;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes === 0) {
      return `약 ${seconds}초`;
    }

    if (seconds === 0) {
      return `약 ${minutes}분`;
    }

    return `약 ${minutes}분 ${seconds}초`;
  }, [artworks.length, autoplay, speed]);

  const handleStart = () => {
    setCurrentIndex(0);
    setMenuOpen(false);
    setScreen("viewing");
  };

  const handleNext = () => {
    if (currentIndex >= artworks.length - 1) {
      setScreen("end");
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;

    setCurrentIndex((prev) => prev - 1);
  };

  const handleScreenClick = () => {
    if (screen !== "viewing" || autoplay || menuOpen) {
      return;
    }

    handleNext();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setMenuOpen(false);
    setScreen("start");
  };

  if (loading) {
    return (
      <main className="flex h-dvh items-center justify-center bg-[#080808] text-[#fafafa]">
        <p className="text-[14px] text-white/40 sm:text-[15px]">
          감상할 작품을 준비하고 있습니다...
        </p>
      </main>
    );
  }

  if (!artworks.length) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center bg-[#080808] px-[20px] text-center text-[#fafafa]">
        <h1 className="font-['Forum'] text-[36px]">VIEWING MODE</h1>

        <p className="mt-[18px] text-[14px] text-white/50">
          감상할 작품이 없습니다.
        </p>

        <Link
          to={source === "curation" ? "/curation" : "/search"}
          className="mt-[30px] rounded-[5px] bg-white/10 px-[24px] py-[13px] text-[14px] text-white/80"
        >
          {source === "curation" ? "큐레이션으로 돌아가기" : "작품 둘러보기"}
        </Link>
      </main>
    );
  }

  if (screen === "start") {
    return (
      <main className="relative h-dvh overflow-hidden bg-[#080808] text-[#fafafa]">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center"
          style={{
            backgroundImage: `url(${artworks[0].image})`,
          }}
        />

        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 backdrop-blur-[5px]" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex shrink-0 items-start justify-between px-[20px] pt-[24px] md:px-[60px] md:pt-[45px] lg:px-[120px] lg:pt-[60px]">
            <h1 className="font-['Forum'] text-[28px] tracking-[-0.02em] md:text-[46px] lg:text-[58px]">
              VIEWING MODE
            </h1>

            <button
              onClick={() => navigate(-1)}
              className="flex flex-col items-center text-white/65 transition-colors hover:text-white"
            >
              <X size={29} strokeWidth={1} className="md:size-[40px]" />

              <span className="mt-[2px] text-[10px] md:text-[13px]">
                나가기
              </span>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-[20px] pb-[24px] pt-[12px] md:px-[40px] md:pb-[45px]">
            <div className="flex h-full max-h-[720px] w-full max-w-[400px] flex-col items-center rounded-[24px] bg-[#fafafa]/10 px-[20px] pb-[22px] pt-[24px] md:grid md:h-auto md:max-h-none md:max-w-[1500px] md:grid-cols-[1fr_0.9fr] md:rounded-[20px] md:px-0 md:py-[30px]">
              <div className="flex h-[31vh] min-h-0 w-full shrink items-center justify-center md:h-auto md:min-h-[520px] md:p-[40px]">
                <img
                  src={artworks[0].image}
                  alt={artworks[0].title}
                  className="max-h-full max-w-full object-contain md:max-h-[500px]"
                />
              </div>

              <div className="mt-[16px] flex w-full min-h-0 flex-1 flex-col items-center text-center md:mt-0 md:items-start md:justify-center md:px-[50px] md:text-left">
                <span className="w-fit rounded-[4px] bg-white/15 px-[11px] py-[6px] text-[11px] text-[#CEB68F] md:text-[14px]">
                  {sourceLabel}
                </span>

                <h2 className="mt-[10px] max-w-[330px] text-[25px] font-semibold leading-[1.2] text-[#CEB68F] md:mt-[18px] md:max-w-none md:text-[38px] lg:text-[42px]">
                  {sourceTitle}
                </h2>

                <dl className="mt-[22px] grid grid-cols-[100px_1fr] gap-y-[12px] text-left text-[13px] md:mt-[36px] md:grid-cols-[120px_1fr] md:gap-y-[18px] md:text-[18px]">
                  <dt className="font-semibold">작품 개수</dt>

                  <dd>{artworks.length}</dd>

                  <dt className="font-semibold">자동재생</dt>

                  <dd>
                    <button
                      onClick={() => setAutoplay((prev) => !prev)}
                      className={`relative h-[22px] w-[42px] rounded-full transition-colors md:h-[27px] md:w-[50px] ${
                        autoplay ? "bg-[#9e2638]" : "bg-white/25"
                      }`}
                    >
                      <span
                        className={`absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white transition-all md:h-[21px] md:w-[21px] ${
                          autoplay ? "left-[23px] md:left-[26px]" : "left-[3px]"
                        }`}
                      />
                    </button>
                  </dd>

                  <dt className="font-semibold">속도</dt>

                  <dd>
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      disabled={!autoplay}
                      className="bg-transparent text-[#fafafa] outline-none disabled:text-white/30"
                    >
                      <option value={5} className="bg-[#292929]">
                        5초
                      </option>

                      <option value={10} className="bg-[#292929]">
                        10초
                      </option>

                      <option value={15} className="bg-[#292929]">
                        15초
                      </option>

                      <option value={20} className="bg-[#292929]">
                        20초
                      </option>
                    </select>
                  </dd>

                  <dt className="font-semibold">예상 감상시간</dt>

                  <dd>{expectedTime}</dd>
                </dl>

                <div className="mt-auto w-full pt-[18px] md:mt-[45px] md:pt-0">
                  <p className="mb-[10px] text-center text-[10px] leading-[1.35] text-[#CEB68F]/45 md:text-left md:text-[14px]">
                    내용을 확인한 후
                    <br className="md:hidden" />
                    감상 시작하기 버튼을 눌러주세요
                  </p>

                  <button
                    onClick={handleStart}
                    className="flex w-full items-center justify-center gap-[16px] rounded-[5px] bg-white/15 px-[20px] py-[13px] text-[15px] transition-colors hover:bg-white/20 md:py-[18px] md:text-[18px]"
                  >
                    감상 시작하기
                    <Play size={21} strokeWidth={1} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (screen === "end") {
    return (
      <main className="relative h-dvh overflow-hidden bg-[#080808] text-[#fafafa]">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center"
          style={{
            backgroundImage: `url(${artworks[0].image})`,
          }}
        />

        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 backdrop-blur-[5px]" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="px-[20px] pt-[28px] md:px-[60px] lg:px-[120px] lg:pt-[60px]">
            <h1 className="font-['Forum'] text-[30px] md:text-[46px] lg:text-[58px]">
              VIEWING MODE
            </h1>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-[20px] pb-[30px]">
            <div className="flex w-full max-w-[420px] flex-col items-center text-center">
              <span className="rounded-[4px] bg-white/15 px-[10px] py-[6px] text-[11px] text-[#CEB68F]">
                감상완료
              </span>

              <h2 className="mt-[14px] text-[27px] font-semibold leading-[1.25] text-[#CEB68F]">
                {sourceTitle}
              </h2>

              <p className="mt-[40px] text-[18px] text-white/75">
                작품 감상이 끝났습니다
              </p>

              <div className="mt-[55px] flex w-full flex-col gap-[10px]">
                <button
                  onClick={() =>
                    navigate(
                      source === "curation" ? "/curation" : "/my_exhibition",
                    )
                  }
                  className="flex w-full items-center justify-center gap-[15px] rounded-[5px] bg-white/10 px-[20px] py-[15px] text-[15px] transition-colors hover:bg-white/15"
                >
                  {source === "curation"
                    ? "큐레이션으로 돌아가기"
                    : "내 전시로 돌아가기"}

                  <RotateCcw size={20} strokeWidth={1.2} />
                </button>

                <button
                  onClick={handleRestart}
                  className="flex w-full items-center justify-center gap-[15px] rounded-[5px] bg-white/10 px-[20px] py-[15px] text-[15px] transition-colors hover:bg-white/15"
                >
                  다시 감상하기
                  <Play size={20} strokeWidth={1.2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      onClick={handleScreenClick}
      className="relative h-dvh cursor-default overflow-hidden bg-[#080808] text-[#fafafa]"
    >
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${currentArtwork.image})`,
        }}
      />

      <div className="absolute inset-0 bg-black/85" />
      <div className="absolute inset-0 backdrop-blur-[5px]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex shrink-0 items-start justify-between px-[20px] pt-[24px] md:px-[60px] md:pt-[45px] lg:px-[120px] lg:pt-[60px]">
          <div>
            <h1 className="font-['Forum'] text-[28px] text-white/85 md:text-[44px] lg:text-[54px]">
              VIEWING MODE
            </h1>

            <p className="mt-[3px] max-w-[270px] truncate text-[13px] text-[#CEB68F]/60 md:mt-[5px] md:max-w-none md:text-[16px]">
              ‘{sourceTitle}’ 감상중
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(true);
            }}
            className="text-white/45 transition-colors hover:text-white"
          >
            <Menu size={30} strokeWidth={1} className="md:size-[36px]" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-[20px] pb-[18px] pt-[22px] md:block md:px-[60px] lg:px-[120px]">
          <div className="flex min-h-0 flex-1 items-center justify-center md:absolute md:inset-0 md:px-[300px] md:py-[130px]">
            <img
              key={currentArtwork.id}
              src={currentArtwork.image}
              alt={currentArtwork.title}
              className="max-h-[56vh] max-w-full object-contain shadow-[0_25px_70px_rgba(0,0,0,0.5)] md:max-h-[72vh]"
            />
          </div>

          {!hideInfo && (
            <div className="mt-[15px] shrink-0 md:absolute md:bottom-[100px] md:right-[120px] md:mt-0 md:max-w-[280px]">
              <p className="text-[14px] text-white/65 md:text-[16px]">
                {currentArtwork.creator}
              </p>

              <h2 className="mt-[3px] line-clamp-2 text-[19px] font-semibold leading-[1.3] md:mt-[5px] md:text-[22px]">
                {currentArtwork.title}
              </h2>

              <p className="mt-[6px] hidden text-[14px] text-white/55 md:block">
                {size}
                <br />
                {year}
              </p>

              <Link
                to={`/artwork/${currentArtwork.id}`}
                onClick={(e) => e.stopPropagation()}
                className="mt-[16px] inline-flex items-center gap-[5px] text-[13px] text-white/40 transition-colors hover:text-white md:mt-[25px] md:text-[14px]"
              >
                작품 상세보기
                <ArrowRight size={15} strokeWidth={1} />
              </Link>
            </div>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-auto flex shrink-0 items-center justify-center gap-[32px] pt-[18px] md:absolute md:bottom-[50px] md:left-[120px] md:mt-0 md:pt-0"
          >
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="text-white/45 transition-colors hover:text-white disabled:text-white/15"
            >
              <ChevronLeft size={31} strokeWidth={1} />
            </button>

            <span className="min-w-[55px] text-center text-[17px] text-white/70">
              {currentIndex + 1}/{artworks.length}
            </span>

            <button
              onClick={handleNext}
              className="text-white/70 transition-colors hover:text-white"
            >
              <ChevronRight size={31} strokeWidth={1} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-40 bg-black/35"
          >
            <aside className="absolute bottom-[12px] right-[12px] top-[12px] flex w-[calc(100%-24px)] flex-col rounded-[20px] bg-[#3c3c3c]/75 p-[26px] backdrop-blur-xl sm:w-[360px] md:bottom-[30px] md:right-[30px] md:top-[30px] lg:w-[420px] lg:p-[45px]">
              <button
                onClick={() => setMenuOpen(false)}
                className="ml-auto text-white/70 transition-colors hover:text-white"
              >
                <ArrowRight size={29} strokeWidth={1} />
              </button>

              <div className="mt-[22px] border-t border-white/35 pt-[35px]">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold">자동재생</span>

                  <button
                    onClick={() => setAutoplay((prev) => !prev)}
                    className={`relative h-[27px] w-[50px] rounded-full transition-colors ${
                      autoplay ? "bg-[#7A2431]" : "bg-white/25"
                    }`}
                  >
                    <span
                      className={`absolute top-[3px] h-[21px] w-[21px] rounded-full bg-white transition-all ${
                        autoplay ? "left-[26px]" : "left-[3px]"
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-[30px] flex items-center justify-between">
                  <span className="text-[15px] font-semibold">속도</span>

                  <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    disabled={!autoplay}
                    className="bg-transparent text-[14px] text-white/80 outline-none disabled:text-white/30"
                  >
                    <option value={5} className="bg-[#444]">
                      5초
                    </option>

                    <option value={10} className="bg-[#444]">
                      10초
                    </option>

                    <option value={15} className="bg-[#444]">
                      15초
                    </option>

                    <option value={20} className="bg-[#444]">
                      20초
                    </option>
                  </select>
                </div>

                <div className="mt-[30px] flex items-center justify-between">
                  <span className="text-[15px] font-semibold">정보 숨기기</span>

                  <button
                    onClick={() => setHideInfo((prev) => !prev)}
                    className={`relative h-[27px] w-[50px] rounded-full transition-colors ${
                      hideInfo ? "bg-[#7A2431]" : "bg-white/25"
                    }`}
                  >
                    <span
                      className={`absolute top-[3px] h-[21px] w-[21px] rounded-full bg-white transition-all ${
                        hideInfo ? "left-[26px]" : "left-[3px]"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setScreen("end")}
                className="mt-auto flex w-full items-center justify-center gap-[18px] rounded-[7px] bg-[#8f2638] px-[20px] py-[16px] text-[16px] transition-colors hover:bg-[#7A2431]"
              >
                감상 종료하기
                <X size={22} strokeWidth={1.2} />
              </button>
            </aside>
          </div>
        )}

        {autoplay && !menuOpen && (
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/10">
            <div
              key={`${currentIndex}-${speed}`}
              className="h-full bg-white/40"
              style={{
                animation: `viewingProgress ${speed}s linear forwards`,
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
