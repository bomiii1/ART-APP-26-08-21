import { ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../components/PageTitle";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageTitle title="404" />

      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-[20px] text-[#fafafa]">
        <div className="w-full max-w-[600px] text-center">
          <p className="font-['Forum'] text-[100px] leading-none text-[#7A2431] sm:text-[140px] md:text-[180px]">
            404
          </p>

          <h1 className="mt-[20px] text-[24px] font-semibold sm:text-[30px]">
            페이지를 찾을 수 없습니다
          </h1>

          <p className="mx-auto mt-[14px] max-w-[420px] text-[14px] font-light leading-[1.8] text-white/45 sm:text-[16px]">
            요청하신 페이지가 존재하지 않거나
            <br />
            이동된 페이지일 수 있습니다.
          </p>

          <div className="mt-[45px] flex flex-col justify-center gap-[10px] sm:flex-row">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-[10px] rounded-[6px] bg-white/10 px-[24px] py-[14px] text-[14px] transition-colors duration-300 hover:bg-white/15 sm:text-[15px]"
            >
              <ArrowLeft size={18} strokeWidth={1.3} />
              이전 페이지
            </button>

            <Link
              to="/"
              className="flex items-center justify-center gap-[10px] rounded-[6px] bg-[#7A2431] px-[24px] py-[14px] text-[14px] transition-colors duration-300 hover:bg-[#8f2b3e] sm:text-[15px]"
            >
              홈으로 이동
              <Home size={18} strokeWidth={1.3} />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
