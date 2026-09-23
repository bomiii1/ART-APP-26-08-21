import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { curationData } from "../../data/curationData";
import { getCurationArtworks } from "../../API/WikidataApi";

const checkImage = (src) => {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);

    image.src = src;
  });
};

function CurationCard({ section, item }) {
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        setLoading(true);
        setThumbnail("");

        if (item.image) {
          const valid = await checkImage(item.image);

          if (valid) {
            setThumbnail(item.image);
            return;
          }
        }

        const artworks = await getCurationArtworks(
          section.property,
          item.value,
          10,
        );

        for (const artwork of artworks) {
          if (!artwork.image) continue;

          const valid = await checkImage(artwork.image);

          if (valid) {
            setThumbnail(artwork.image);
            return;
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadThumbnail();
  }, [section.property, item.value, item.image]);

  return (
    <Link
      to={`/curation/${section.category.toLowerCase()}/${item.id}`}
      className="group block"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#e8e3e0]">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {!loading && (
              <span className="text-[12px] text-[#3c3c3c]/30">이미지 없음</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-[4px] flex items-start justify-between gap-2 sm:mt-[8px] lg:mt-[12px]">
        <p className="text-[16px] text-[#3c3c3c]/80 transition group-hover:font-medium group-hover:text-[#7A2431] sm:text-[18px] lg:text-[24px]">
          {item.title}
        </p>

        <ArrowUpRight className="shrink-0 text-[#3c3c3c]/80 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-125 group-hover:text-[#7A2431]" />
      </div>
    </Link>
  );
}

export default function Curation() {
  return (
    <main className="bg-[#f7f5f4] pt-[80px] text-[#292929]">
      <section className="bg-[#d4cdca]">
        <div className="px-[10px] py-[30px] sm:px-[30px] sm:py-[40px] lg:px-[150px] lg:py-[60px]">
          <h1 className="font-serif text-[24px] text-[#8a3242] sm:text-[32px] lg:text-[42px]">
            CURATION
          </h1>

          <p className="mt-[4px] text-[11px] text-[#666] sm:mt-[8px] sm:text-[14px] lg:mt-[10px] lg:text-[18px]">
            다양한 시선으로 모아본 작품들을 천천히 감상해보세요.
          </p>
        </div>
      </section>

      <div className="px-[10px] py-[24px] sm:px-[30px] sm:py-[60px] lg:px-[150px] lg:py-[100px]">
        {curationData.map((section) => (
          <section
            key={section.category}
            className="mb-[50px] last:mb-0 sm:mb-[90px] lg:mb-[140px]"
          >
            <div className="mb-[10px] flex items-end justify-between border-b border-[#d8d2cf] pb-[8px] sm:mb-[18px] sm:pb-[12px] lg:mb-[28px] lg:pb-[18px]">
              <div>
                <h2 className="font-serif text-[26px] leading-none text-[#d4bfc2] sm:text-[34px] lg:text-[45px]">
                  {section.category}
                </h2>

                <p className="mt-[4px] text-[12px] leading-tight sm:mt-[6px] sm:text-[20px] lg:mt-[10px] lg:text-[32px]">
                  {section.description}
                </p>
              </div>

              <span className="hidden text-[14px] text-[#BFB8B8] sm:block lg:text-[20px]">
                총{" "}
                <span className="text-[#7A2431]">{section.items.length}</span>개
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-[10px] gap-y-[10px] sm:gap-x-[18px] sm:gap-y-[24px] lg:grid-cols-4 lg:gap-x-[28px] lg:gap-y-[42px]">
              {section.items.map((item) => (
                <CurationCard key={item.id} section={section} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
