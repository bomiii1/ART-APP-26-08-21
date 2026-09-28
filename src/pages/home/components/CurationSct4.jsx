import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { curationData } from "../../../data/curationData";
import { getCurationArtworks } from "../../../API/WikidataApi";

const checkImage = (src) => {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);

    image.src = src;
  });
};

function FeaturedCurationCard({ item }) {
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
          item.property,
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
  }, [item.image, item.property, item.value]);

  return (
    <Link
      to={`/curation/${item.category}/${item.id}`}
      className="group relative block"
    >
      <div className="relative h-[160px] w-full overflow-hidden bg-[#e8e3e0] sm:h-auto sm:aspect-[640/600]">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#e8e3e0]">
            {!loading && (
              <span className="text-[12px] text-[#3c3c3c]/30">이미지 없음</span>
            )}
          </div>
        )}

        <div className="absolute inset-0 bg-black/20 sm:hidden" />

        <div className="absolute inset-0 flex items-center justify-center px-[20px] sm:hidden">
          <p className="text-center text-[17px] font-medium text-white">
            {item.title}
          </p>
        </div>
      </div>

      <div className="hidden py-[14px] text-center sm:block lg:py-[16px]">
        <p className="text-[16px] text-[#3c3c3c]/50 transition-colors duration-300 group-hover:text-[#3c3c3c] lg:text-[24px]">
          {item.title}
        </p>
      </div>
    </Link>
  );
}

export default function CurationSct4() {
  const featuredCurations = [
    {
      ...curationData[0].items[0],
      category: "artist",
      property: curationData[0].property,
    },
    {
      ...curationData[0].items[3],
      category: "artist",
      property: curationData[0].property,
    },
    {
      ...curationData[2].items[0],
      category: "theme",
      property: curationData[2].property,
    },
  ];

  return (
    <section className="bg-[#fafafa] py-[70px] sm:py-[80px] lg:py-[100px]">
      <div className="px-[20px] sm:px-[40px] md:px-[60px] lg:px-[150px]">
        <div className="flex-col items-end justify-between">
          <div>
            <h2 className="font-['Forum'] text-[38px] leading-none text-[#3c3c3c] sm:text-[48px] lg:text-[60px]">
              Curation
            </h2>

            <p className="mt-[8px] text-[14px] text-[#3c3c3c]/60 sm:text-[18px] lg:mt-[12px] lg:text-[24px]">
              다양한 시선으로 모아본 작품들을 천천히 감상해보세요.
            </p>
          </div>

          <div className="flex justify-end mt-3">
            <Link
              to="/curation"
              className=" text-[12px] text-[#3c3c3c]/70 transition-colors duration-300 hover:text-[#7A2431] sm:text-[14px] lg:text-[20px]"
            >
              전체보기 +
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-[10px] grid grid-cols-1 sm:mt-[30px] sm:grid-cols-3">
        {featuredCurations.map((item) => (
          <FeaturedCurationCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
