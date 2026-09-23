import { useEffect, useState } from "react";
import { ArrowLeft, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { curationData } from "../../data/curationData";
import { getCurationArtworks } from "../../API/WikidataApi";

export default function CurationDetail() {
  const { category, id } = useParams();

  const [artworks, setArtworks] = useState([]);
  const [failedImages, setFailedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const section = curationData.find(
    (section) => section.category.toLowerCase() === category,
  );

  const curation = section?.items.find((item) => item.id === id);

  useEffect(() => {
    if (!section || !curation) {
      setLoading(false);
      return;
    }

    const loadArtworks = async () => {
      try {
        setLoading(true);
        setFailedImages([]);

        const data = await getCurationArtworks(
          section.property,
          curation.value,
        );

        setArtworks(data.slice(0, 50));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, [category, id]);

  if (!section || !curation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] pt-[80px]">
        <p className="text-[18px] text-[#3c3c3c]/60">
          큐레이션을 찾을 수 없습니다.
        </p>
      </main>
    );
  }

  const visibleArtworks = artworks.filter(
    (artwork) => !failedImages.includes(artwork.id),
  );

  const heroImage = curation.image || visibleArtworks[0]?.image;

  return (
    <main className="bg-[#fafafa] pt-[80px] text-[#3c3c3c]">
      <section
        className="relative min-h-[460px] overflow-hidden bg-[#292929] bg-cover bg-center"
        style={
          heroImage
            ? {
                backgroundImage: `url(${heroImage})`,
              }
            : {}
        }
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex min-h-[480px] flex-col justify-between px-[20px] py-[35px] sm:px-[40px] lg:px-[150px] lg:py-[50px]">
          <Link
            to="/curation"
            className="group flex w-fit flex-col items-start text-white/75 transition-colors duration-300 hover:text-white"
          >
            <ArrowLeft
              size={32}
              strokeWidth={1.3}
              className="transition-transform duration-300 group-hover:-translate-x-[4px]"
            />

            <span className="mt-[8px] text-[13px] lg:text-[14px]">
              돌아가기
            </span>
          </Link>

          <div className="flex items-end justify-between gap-[40px]">
            <div>
              <h1 className="text-[34px] font-medium text-white sm:text-[42px] lg:text-[60px]">
                {curation.title}
              </h1>

              <p className="mt-[12px] max-w-[780px] text-[14px] leading-[1.7] text-white/65 sm:text-[16px] lg:text-[24px]">
                {curation.description}
              </p>
            </div>

            <Link
              to="/viewing"
              className="hidden items-center gap-[26px] rounded-[4px] border border-white/30 bg-white/15 px-[32px] py-[18px] text-[17px] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/25 lg:flex"
            >
              전체 감상
              <Play size={19} strokeWidth={1.3} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-[20px] py-[55px] sm:px-[40px] lg:px-[150px] lg:py-[90px]">
        <div className="mb-[28px] flex items-center justify-between lg:mb-[40px]">
          <p className="text-[16px] text-[#3c3c3c]/40 lg:text-[20px]">
            총 <span className="text-[#7A2431]">{visibleArtworks.length}</span>
            개
          </p>

          <Link
            to="/viewing"
            className="flex items-center gap-[10px] rounded-[4px] border border-[#3c3c3c]/15 px-[18px] py-[11px] text-[13px] text-[#3c3c3c] transition-all duration-300 hover:border-[#7A2431] hover:text-[#7A2431] lg:hidden"
          >
            전체 감상
            <Play size={15} strokeWidth={1.3} />
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <p className="text-[16px] text-[#3c3c3c]/40 lg:text-[18px]">
              작품을 불러오는 중입니다...
            </p>
          </div>
        ) : visibleArtworks.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-[16px] text-[#3c3c3c]/40">
              해당 큐레이션의 작품을 찾지 못했습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-[12px] gap-y-[12px] sm:gap-[20px] lg:grid-cols-4 lg:gap-x-[45px] lg:gap-y-[30px]">
            {visibleArtworks.map((artwork) => (
              <Link
                key={artwork.id}
                to={`/artwork/${artwork.id}`}
                className="group block"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#ece9e7]">
                  <img
                    src={artwork.image}
                    alt=""
                    onError={() => {
                      setFailedImages((prev) =>
                        prev.includes(artwork.id)
                          ? prev
                          : [...prev, artwork.id],
                      );
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
