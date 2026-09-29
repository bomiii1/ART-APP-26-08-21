import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getArtworkDetail } from "../../API/WikidataApi";
import Loading from "../../components/Loading";
import PageTitle from "../../components/PageTitle";

const cleanValue = (value) => {
  if (!value) return "-";

  const cleaned = String(value).trim();

  if (!cleaned) return "-";

  if (
    cleaned.startsWith("http://") ||
    cleaned.startsWith("https://") ||
    cleaned.includes("wikidata.org") ||
    cleaned.includes(".well-known/genid") ||
    /^Q\d+$/i.test(cleaned)
  ) {
    return "-";
  }

  return cleaned;
};

const cleanListValue = (value) => {
  if (!value) return "-";

  const values = String(value)
    .split(",")
    .map((item) => cleanValue(item))
    .filter((item) => item !== "-");

  const uniqueValues = [...new Set(values)];

  return uniqueValues.length > 0 ? uniqueValues.join(", ") : "-";
};

export default function ArtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const loadArtwork = async () => {
      try {
        setLoading(true);

        const data = await getArtworkDetail(id);

        setArtwork(data);

        const saved = JSON.parse(localStorage.getItem("myExhibition") || "[]");

        setAdded(saved.some((item) => item.id === id));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadArtwork();
  }, [id]);

  const handleAddExhibition = () => {
    if (!artwork) return;

    const saved = JSON.parse(localStorage.getItem("myExhibition") || "[]");

    const exists = saved.some((item) => item.id === artwork.id);

    if (exists) {
      const updated = saved.filter((item) => item.id !== artwork.id);

      localStorage.setItem("myExhibition", JSON.stringify(updated));

      setAdded(false);
      return;
    }

    const updated = [...saved, artwork];

    localStorage.setItem("myExhibition", JSON.stringify(updated));

    setAdded(true);
  };

  if (loading) {
    return <Loading />;
  }

  if (!artwork) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] pt-[80px]">
        <p className="text-[15px] text-white/40">
          작품 정보를 찾을 수 없습니다.
        </p>
      </main>
    );
  }

  const year = artwork.date ? new Date(artwork.date).getFullYear() : "-";

  const size =
    artwork.width && artwork.height
      ? `${Number(artwork.width).toFixed(1)} × ${Number(artwork.height).toFixed(
          1,
        )} cm`
      : "-";

  const keywords = artwork.depicts
    ? artwork.depicts
        .split(",")
        .map((item) => cleanValue(item))
        .filter((item) => item !== "-")
        .filter((item, index, array) => array.indexOf(item) === index)
        .slice(0, 5)
    : [];

  const materials = cleanListValue(artwork.materials);
  const movement = cleanListValue(artwork.movement);
  const place = cleanListValue(artwork.place);
  const collection = cleanListValue(artwork.collection);

  const creator = cleanValue(artwork.creator);
  const title = cleanValue(artwork.title);
  const description = cleanValue(artwork.description);

  return (
    <>
      <PageTitle title={title} />
      <main className="relative min-h-screen overflow-hidden bg-[#080808] pt-[80px] text-[#fafafa]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${artwork.image})`,
          }}
        />

        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="relative z-10 px-[20px] py-[40px] sm:px-[40px] md:px-[60px] lg:px-[100px] lg:py-[60px] xl:px-[150px]">
          <button
            onClick={() => navigate(-1)}
            className="group flex flex-col items-start text-white/80 transition-colors duration-300 hover:text-white"
          >
            <ArrowLeft
              size={38}
              strokeWidth={1}
              className="transition-transform duration-300 group-hover:-translate-x-[4px]"
            />

            <span className="mt-[8px] text-[13px] sm:text-[14px]">
              돌아가기
            </span>
          </button>

          <div className="mx-auto mt-[40px] grid max-w-[1400px] grid-cols-1 gap-[50px] md:mt-[55px] md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-[55px] lg:gap-[70px]">
            <div className="flex justify-center md:justify-end">
              <div className="flex h-[460px] w-full items-center justify-center sm:h-[580px] md:h-[620px] lg:h-[680px]">
                <img
                  src={artwork.image}
                  alt={title === "-" ? "작품 이미지" : title}
                  className="max-h-full max-w-full object-contain shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
                />
              </div>
            </div>

            <div className="w-full max-w-[620px]">
              <p className="text-[18px] font-semibold text-white/85 sm:text-[20px] lg:text-[24px]">
                {creator}
              </p>

              <h1 className="mt-[6px] text-[36px] font-bold leading-[1.15] tracking-[-0.03em] sm:text-[46px] md:text-[42px] lg:text-[52px]">
                {title}
              </h1>

              {artwork.titleEn && (
                <p className="mt-[12px] text-[14px] text-white/55 sm:text-[15px] lg:text-[17px]">
                  {artwork.titleEn}
                </p>
              )}

              {keywords.length > 0 && (
                <div className="mt-[28px] flex flex-wrap gap-[10px]">
                  {keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-[#CEB68F]/60 bg-[#CEB68F]/10 px-[16px] py-[7px] text-[13px] text-[#e4d3b7] sm:text-[14px] lg:px-[18px] lg:text-[16px]"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}

              <dl className="mt-[36px] grid grid-cols-[90px_1fr] gap-x-[10px] gap-y-[14px] text-[15px] sm:grid-cols-[110px_1fr] sm:text-[17px] lg:text-[20px]">
                <dt className="text-white/45">제작연도</dt>
                <dd>{year}</dd>

                <dt className="text-white/45">재료</dt>
                <dd>{materials}</dd>

                <dt className="text-white/45">크기</dt>
                <dd>{size}</dd>

                <dt className="text-white/45">미술 사조</dt>
                <dd>{movement}</dd>

                <dt className="text-white/45">제작 장소</dt>
                <dd>{place}</dd>

                <dt className="text-white/45">소장처</dt>
                <dd>{collection}</dd>
              </dl>

              <button
                onClick={handleAddExhibition}
                className={`mt-[38px] flex w-full items-center justify-center gap-[18px] rounded-[6px] px-[24px] py-[19px] text-[16px] backdrop-blur-md transition-all duration-300 sm:text-[18px] lg:mt-[45px] lg:py-[22px] lg:text-[20px] ${
                  added
                    ? "bg-[#7A2431] hover:bg-[#7A2431]/90"
                    : "bg-white/15 hover:bg-white/25"
                }`}
              >
                {added ? "내 전시에 추가됨" : "내 전시에 추가하기"}

                {added ? (
                  <CheckCircle2 size={22} strokeWidth={1.2} />
                ) : (
                  <Plus size={22} strokeWidth={1.2} />
                )}
              </button>
            </div>
          </div>

          <section className="mx-auto mt-[70px] max-w-[1400px] pb-[80px] md:mt-[80px] lg:mt-[90px] lg:pb-[110px]">
            <h2 className="text-[18px] font-medium text-white/60 sm:text-[20px]">
              작품소개
            </h2>

            <div className="mt-[20px] max-w-[1250px]">
              {description !== "-" ? (
                <p className="text-[14px] font-light leading-[2] text-white/80 sm:text-[15px] md:text-[16px] lg:text-[18px]">
                  {description}
                </p>
              ) : (
                <p className="text-[14px] font-light leading-[2] text-white/45 sm:text-[15px]">
                  작품에 대한 소개 정보가 없습니다.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
