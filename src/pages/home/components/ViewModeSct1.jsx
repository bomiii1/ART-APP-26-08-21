import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import sct1Bg from "../../../img/homeImg/sct1_bg.png";
import tapIcon from "../../../img/homeImg/tap_icon.png";
import viewmodeBg from "../../../img/homeImg/viewmodecapture.png";

export default function ViewModeSct1() {
  const viewingLink = {
    pathname: "/viewing",
  };

  const viewingState = {
    source: "myExhibition",
    title: "MY EXHIBITION",
  };

  return (
    <section className="w-full bg-[#080808]">
      <div className="w-full overflow-hidden md:grid md:h-[520px] md:grid-cols-[48%_52%] lg:h-[650px] lg:grid-cols-[40%_60%]">
        <div className="relative min-h-[420px] overflow-hidden sm:min-h-[470px] md:h-full md:min-h-0">
          <img
            src={sct1Bg}
            alt=""
            className="absolute inset-0 h-full w-full scale-[1.4] object-cover object-center sm:scale-[1.6] md:scale-[1.9] md:object-[40%_center] lg:scale-[2.4] lg:object-[20%_45%] xl:scale-[2.5] xl:object-[10%_45%]"
          />

          <div className="absolute inset-0 bg-[#3c3c3c]/70" />
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 flex h-full flex-col justify-center px-[16px] py-[55px] text-[#fafafa] sm:px-[40px] md:items-end md:px-[35px] md:py-0 lg:pl-[60px] lg:pr-[100px] xl:pl-[150px]">
            <div className="flex w-full flex-col md:w-fit">
              <h2 className="font-['Forum'] text-[38px] leading-none sm:text-[48px] md:text-[42px] lg:text-[60px]">
                Viewing Mode
              </h2>

              <p className="mt-[12px] text-[16px] font-light text-[#fafafa]/60 sm:text-[18px] md:text-[15px] lg:mt-[14px] lg:text-[24px]">
                아트룸의 감상모드를 소개합니다
              </p>

              <div className="mt-[28px] flex justify-end">
                <Link
                  to={viewingLink}
                  state={viewingState}
                  className="flex w-fit items-center gap-[10px] rounded-[6px] bg-white/20 px-[22px] py-[12px] text-[16px] font-light text-[#fafafa] backdrop-blur-[2px] transition-all duration-300 hover:scale-105 hover:bg-white/30 md:px-[18px] md:py-[10px] md:text-[15px] lg:gap-[12px] lg:px-[28px] lg:py-[14px] lg:text-[22px]"
                >
                  감상모드
                  <Play
                    size={20}
                    strokeWidth={1.3}
                    className="md:h-[17px] md:w-[17px] lg:h-[20px] lg:w-[20px]"
                  />
                </Link>
              </div>

              <Link
                to={viewingLink}
                state={viewingState}
                className="group relative mt-[30px] block aspect-[16/9] w-full overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.25)] md:hidden"
              >
                <img
                  src={viewmodeBg}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover brightness-[0.45] sm:brightness-[0.55]"
                />

                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute inset-0 flex flex-col items-center justify-center px-[20px] text-center">
                  <p className="text-[12px] font-light leading-[1.6] text-[#fafafa]/90 sm:text-[14px]">
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
          to={viewingLink}
          state={viewingState}
          className="group relative hidden h-full cursor-pointer items-center justify-center overflow-hidden md:flex"
        >
          <img
            src={viewmodeBg}
            alt="감상모드 배경"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-black/75 transition-colors duration-300 group-hover:bg-black/60" />

          <div className="relative z-10 flex flex-col items-center px-[30px] text-center text-[#fafafa] lg:px-[40px]">
            <p className="text-[15px] font-light leading-[1.65] text-[#fafafa]/90 lg:text-[24px] lg:leading-[1.45]">
              미술관을 직접 방문하지 않아도
              <br />
              깊이있는 감상이 가능한 감상모드를 즐겨보세요
            </p>

            <img
              src={tapIcon}
              alt="클릭 아이콘"
              className="mt-[20px] w-[32px] animate-[tapFade_2.2s_ease-in-out_infinite] opacity-70 transition-transform duration-300 group-hover:scale-105 lg:mt-[22px] lg:w-[42px]"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
