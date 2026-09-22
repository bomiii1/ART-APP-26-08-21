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
      <section className="flex min-h-[600px] items-center justify-center bg-[#fafafa]">
        <p className="text-[18px] text-[#3c3c3c]/50">
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
    <section className="bg-[#fafafa] px-[150px] py-[100px]">
      <div>
        <h2 className="font-['Forum'] text-[60px] leading-none text-[#3c3c3c]">
          Today’s Pick
        </h2>

        <p className="mt-[12px] text-[24px] text-[#3c3c3c]/60">
          오늘 이 작품을 추천합니다.
        </p>
      </div>

      <div className="mt-[55px] flex justify-center items-center gap-[100px]">
        <div className="flex h-[650px] w-[40vw] items-center justify-end">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="flex min-h-[440px] flex-1 items-center">
          <div className="w-full max-w-[520px] text-[#3c3c3c]">
            <div className=" pb-[22px]">
              <p className="text-[22px] text-[#3c3c3c]">작품명</p>
              <p className="mt-[15px] text-[24px] font-bold">{artwork.title}</p>
            </div>

            <div className=" py-[22px]">
              <p className="text-[22px] text-[#3c3c3c]">화가</p>
              <p className="mt-[15px] text-[24px] font-bold">
                {artwork.creator}
              </p>
            </div>

            <div className=" py-[22px]">
              <p className="text-[22px] text-[#3c3c3c]">제작년도</p>
              <p className="mt-[15px] text-[24px] font-bold">{year}</p>
            </div>

            <div className="py-[22px]">
              <p className="text-[22px] text-[#3c3c3c]">작품크기</p>
              <p className="mt-[15px] text-[24px] font-bold">{size}</p>
            </div>

            <Link
              to={`/artwork/${artwork.id}`}
              className="mt-[30px] inline-flex items-center gap-[16px] bg-[#7A2431] px-[25px] py-[15px] text-[17px] text-[#fafafa] transition-all duration-300 hover:bg-[#7A2431]/90 hover:scale-105 rounded-[8px]"
            >
              작품 상세보기
              <ArrowRight size={18} strokeWidth={1.4} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
