import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getTodayPickArtwork } from "../../../API/WikidataApi";

export default function TodayPickSct3() {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodayPick = async () => {
      try {
        const data = await getTodayPickArtwork();
        setArtwork(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTodayPick();
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[500px] items-center justify-center bg-[#fafafa] px-[16px]">
        <p className="text-center text-[14px] text-[#3c3c3c]/50 sm:text-[16px] lg:text-[18px]">
          오늘의 작품을 불러오는 중입니다...
        </p>
      </section>
    );
  }

  if (!artwork) return null;

  const year = artwork.date
    ? new Date(artwork.date).getFullYear()
    : "정보 없음";

  const size =
    artwork.height && artwork.width
      ? `${artwork.height} × ${artwork.width} cm`
      : "정보 없음";

  return (
    <section className="bg-[#fafafa] px-[16px] py-[70px] sm:px-[40px] sm:py-[80px] md:px-[60px] lg:px-[150px] lg:py-[100px]">
      <div>
        <h2 className="font-['Forum'] text-[38px] leading-none text-[#3c3c3c] sm:text-[46px] md:text-[52px] lg:text-[60px]">
          Today’s Pick
        </h2>

        <p className="mt-[10px] text-[16px] text-[#3c3c3c]/60 sm:text-[16px] md:text-[18px] lg:mt-[12px] lg:text-[24px]">
          오늘 이 작품을 추천합니다.
        </p>
      </div>

      <div className="mt-[40px] flex flex-col gap-[40px] md:grid md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-[50px] lg:mt-[30px] lg:grid-cols-[1.2fr_0.8fr] lg:gap-[100px]">
        <div className="flex w-full items-center justify-center md:justify-end">
          <div className="flex h-[360px] w-full items-center justify-center sm:h-[460px] md:h-[520px] lg:h-[650px]">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        <div className="flex w-full items-center">
          <div className="w-full max-w-[520px] text-[#3c3c3c]">
            <div className="pb-[10px] sm:pb-[12px]">
              <p className="text-[14px] text-[#3c3c3c]/70 sm:text-[16px] md:text-[17px] lg:text-[22px]">
                작품명
              </p>
              <p className="mt-[5px] text-[18px] font-bold leading-[1.4] sm:text-[20px] md:text-[21px] lg:text-[24px]">
                {artwork.title}
              </p>
            </div>

            <div className="py-[10px] sm:py-[12px]">
              <p className="text-[14px] text-[#3c3c3c]/70 sm:text-[16px] md:text-[17px] lg:text-[22px]">
                화가
              </p>
              <p className="mt-[5px] text-[18px] font-bold sm:text-[20px] md:text-[21px] lg:text-[24px]">
                {artwork.creator}
              </p>
            </div>

            <div className="py-[10px] sm:py-[12px]">
              <p className="text-[14px] text-[#3c3c3c]/70 sm:text-[16px] md:text-[17px] lg:text-[22px]">
                제작년도
              </p>
              <p className="mt-[5px] text-[18px] font-bold sm:text-[20px] md:text-[21px] lg:text-[24px]">
                {year}
              </p>
            </div>

            <div className="py-[10px] sm:py-[12px]">
              <p className="text-[14px] text-[#3c3c3c]/70 sm:text-[16px] md:text-[17px] lg:text-[22px]">
                작품크기
              </p>
              <p className="mt-[5px] text-[18px] font-bold sm:text-[20px] md:text-[21px] lg:text-[24px]">
                {size}
              </p>
            </div>

            <Link
              to={`/artwork/${artwork.id}`}
              className="mt-[24px] inline-flex items-center gap-[12px] rounded-[6px] bg-[#7A2431] px-[20px] py-[12px] text-[14px] text-[#fafafa] transition-all duration-300 hover:scale-105 hover:bg-[#7A2431]/90 sm:text-[15px] md:px-[22px] md:py-[13px] md:text-[16px] lg:mt-[30px] lg:gap-[16px] lg:px-[25px] lg:py-[15px] lg:text-[17px]"
            >
              작품 상세보기
              <ArrowRight
                size={18}
                strokeWidth={1.4}
                className="h-[16px] w-[16px] lg:h-[18px] lg:w-[18px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
