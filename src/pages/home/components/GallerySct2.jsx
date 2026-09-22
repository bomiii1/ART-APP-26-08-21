import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { getGalleryArtworks } from "../../../API/WikidataApi";

import "swiper/css";

export default function GallerySct2() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getGalleryArtworks();

        setArtworks(data);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const handleMouseEnter = () => {
    swiperRef.current?.autoplay.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.autoplay.start();
  };

  return (
    <section className="w-full overflow-hidden bg-[#fafafa] py-[100px]">
      <div className="px-[20px] md:px-[60px] lg:px-[150px]">
        <h2 className="font-['Forum'] text-[48px] text-[#3c3c3c] lg:text-[60px]">
          Gallery
        </h2>

        <p className="mt-[-5px] text-[18px] text-[#3c3c3c]/60 lg:text-[24px]">
          지금 눈에 들어오는 작품부터 자유롭게 감상해보세요
        </p>
      </div>

      <div className="mt-[50px] min-h-[460px]">
        {loading && (
          <div className="flex h-[420px] items-center justify-center">
            <p className="text-[18px] font-light text-[#292929]/50">
              작품을 불러오는 중입니다...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-[420px] items-center justify-center">
            <p className="text-[18px] font-light text-[#292929]/50">
              작품을 불러오지 못했습니다.
            </p>
          </div>
        )}

        {!loading && !error && artworks.length === 0 && (
          <div className="flex h-[420px] items-center justify-center">
            <p className="text-[18px] font-light text-[#292929]/50">
              표시할 작품이 없습니다.
            </p>
          </div>
        )}

        {!loading && !error && artworks.length > 0 && (
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Swiper
              modules={[Autoplay]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              loop={true}
              speed={25000}
              spaceBetween={30}
              slidesPerView={4.3}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1.3,
                  spaceBetween: 16,
                },
                640: {
                  slidesPerView: 2.2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3.3,
                  spaceBetween: 24,
                },
                1440: {
                  slidesPerView: 4.3,
                  spaceBetween: 30,
                },
              }}
              className="gallery-swiper"
            >
              {artworks.map((artwork) => (
                <SwiperSlide key={artwork.id}>
                  <div className="cursor-pointer">
                    <div className="h-[420px] overflow-hidden bg-[#fafafa]">
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <h3 className="mt-[14px] text-[18px] font-medium text-[#292929]">
                      {artwork.title}
                    </h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
