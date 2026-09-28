import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { searchWikidataArtworks } from "../../API/WikidataApi";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const searchKeyword = keyword.trim();

    if (!searchKeyword) {
      setSearchedKeyword("");
      setArtworks([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearchedKeyword(searchKeyword);
      setArtworks([]);

      const data = await searchWikidataArtworks(searchKeyword, 20);

      console.log("검색 결과:", data);

      setArtworks(data);
    } catch (error) {
      console.error("검색 오류:", error);
      setError("검색 결과를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] pt-[80px]">
      <section className="bg-[#d4cdca] px-[20px] py-[55px] sm:px-[40px] sm:py-[65px] md:px-[60px] lg:px-[150px] lg:py-[70px]">
        <h1 className="font-['Forum'] text-[38px] leading-none text-[#7A2431] sm:text-[46px] lg:text-[52px]">
          SEARCH
        </h1>

        <p className="mt-[10px] text-[14px] text-[#3c3c3c]/65 sm:text-[16px] lg:text-[18px]">
          화가와 작품명을 검색해 원하는 작품을 만나보세요.
        </p>
      </section>

      <section className="min-h-[650px] px-[20px] py-[50px] sm:px-[40px] sm:py-[60px] md:px-[60px] lg:px-[150px] lg:py-[80px]">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[420px] items-center border-b border-[#3c3c3c]/25 pb-[10px] sm:max-w-[460px]"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="화가나 작품명을 검색해보세요"
            className="w-full bg-transparent text-[16px] text-[#3c3c3c] outline-none placeholder:text-[#3c3c3c]/25"
          />

          <button
            type="submit"
            className="flex cursor-pointer shrink-0 items-center justify-center text-[#3c3c3c]/50 transition-colors duration-300 hover:text-[#7A2431]"
          >
            <SearchIcon size={21} strokeWidth={1.3} />
          </button>
        </form>

        {!searchedKeyword && !loading && (
          <div className="flex min-h-[420px] items-center justify-center">
            <p className="text-[16px] text-[#3c3c3c]/30">
              검색내용을 입력해주세요.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex min-h-[420px] items-center justify-center">
            <p className="text-[14px] text-[#3c3c3c]/30 sm:text-[16px]">
              작품을 검색하는 중입니다...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="flex min-h-[420px] items-center justify-center">
            <p className="text-[14px] text-[#3c3c3c]/40 sm:text-[16px]">
              {error}
            </p>
          </div>
        )}

        {searchedKeyword && !loading && !error && artworks.length === 0 && (
          <div className="flex min-h-[420px] items-center justify-center">
            <p className="text-[14px] text-[#3c3c3c]/30 sm:text-[16px]">
              검색 결과가 없습니다.
            </p>
          </div>
        )}

        {searchedKeyword && !loading && !error && artworks.length > 0 && (
          <div className="mt-[55px]">
            <p className="mb-[20px] text-[14px] text-[#3c3c3c]/55 sm:text-[16px] lg:text-[18px]">
              <span className="text-[#3c3c3c]">‘{searchedKeyword}’</span> 검색
              결과
            </p>

            <div className="grid grid-cols-2 gap-x-[14px] gap-y-[30px] sm:grid-cols-3 sm:gap-x-[18px] lg:grid-cols-4 lg:gap-x-[24px] lg:gap-y-[40px]">
              {artworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  to={`/artwork/${artwork.id}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#e8e3e0]">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-[#fafafa]/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="text-[14px] text-[#3c3c3c] sm:text-[15px] lg:text-[17px]">
                        상세보기 →
                      </span>
                    </div>
                  </div>

                  <div className="pt-[10px]">
                    <p className="text-[14px] leading-[1.4] text-[#3c3c3c] sm:text-[15px] lg:text-[17px]">
                      {artwork.title}
                    </p>

                    <p className="mt-[3px] text-[12px] text-[#3c3c3c]/55 sm:text-[13px] lg:text-[14px]">
                      {artwork.creator}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
