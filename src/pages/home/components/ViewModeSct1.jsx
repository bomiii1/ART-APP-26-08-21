import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import sct1Bg from "../../../img/homeImg/sct1_bg.png";
import tapIcon from "../../../img/homeImg/tap_icon.png";

export default function ViewModeSct1() {
  return (
    <section className="w-full bg-[#080808]">
      <div className="w-full overflow-hidden h-[450px]  md:h-[650px] md:grid-cols-[40%_60%]">
        <div className="relative overflow-hidden">
          <img
            src={sct1Bg}
            alt=""
            className="absolute inset-0 h-full w-full scale-[1.35] object-cover object-center sm:scale-[1.6] md:scale-[2.3] md:object-[-180%_45%]"
          />

          <div className="absolute inset-0 bg-[#3c3c3c]/70" />
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 flex min-h-[620px] flex-col px-[16px] py-[55px] text-[#fafafa] sm:px-[40px] md:h-full md:min-h-0 md:items-end md:justify-center md:py-0 md:pr-[60px] md:pl-[40px] lg:pr-[100px] lg:pl-[150px]">
            <div className="w-full md:w-auto">
              <h2 className="font-['Forum'] text-[40px] leading-none sm:text-[48px] lg:text-[60px]">
                Viewing Mode
              </h2>

              <p className="mt-[12px] text-[16px] font-light text-[#fafafa]/60 sm:text-[18px] lg:mt-[14px] lg:text-[24px]">
                아트룸의 감상모드를 소개합니다
              </p>

              <div className="mt-[28px] flex justify-end md:justify-start">
                <Link
                  to="/viewing"
                  className="flex w-fit items-center gap-[12px] rounded-[6px] bg-white/20 px-[22px] py-[12px] text-[16px] font-light text-[#fafafa] backdrop-blur-[2px] transition-all duration-300 hover:scale-105 hover:bg-white/30 sm:text-[18px] lg:px-[28px] lg:py-[14px] lg:text-[22px]"
                >
                  감상모드
                  <Play size={20} strokeWidth={1.3} />
                </Link>
              </div>

              <Link
                to="/viewing"
                className="group relative mt-[30px] block aspect-[16/9] w-full overflow-hidden bg-[#080808] shadow-[0_10px_30px_rgba(0,0,0,0.25)] md:hidden"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center px-[20px] text-center">
                  <p className="text-[12px] font-light leading-[1.6] text-[#fafafa]/80">
                    미술관을 직접 방문하지 않아도
                    <br />
                    깊이있는 감상이 가능한 감상모드를 즐겨보세요
                  </p>

                  <img
                    src={tapIcon}
                    alt="클릭 아이콘"
                    className="mt-[18px] w-[32px] animate-[tapFade_2.2s_ease-in-out_infinite] opacity-70 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <Link
          to="/viewing"
          className="group relative hidden cursor-pointer items-center justify-center bg-[#080808] md:flex"
        >
          <div className="flex flex-col items-center px-[40px] text-center text-[#fafafa]">
            <p className="text-[18px] font-light leading-[1.6] lg:text-[24px] lg:leading-[1.45]">
              미술관을 직접 방문하지 않아도
              <br />
              깊이있는 감상이 가능한 감상모드를 즐겨보세요
            </p>

            <img
              src={tapIcon}
              alt="클릭 아이콘"
              className="mt-[22px] w-[38px] animate-[tapFade_2.2s_ease-in-out_infinite] transition-transform duration-300 group-hover:scale-105 lg:w-[42px]"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
