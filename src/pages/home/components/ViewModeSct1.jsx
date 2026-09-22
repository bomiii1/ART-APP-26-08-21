import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import sct1Bg from "../../../img/homeImg/sct1_bg.png";
import tapIcon from "../../../img/homeImg/tap_icon.png";

export default function ViewModeSct1() {
  return (
    <section className="grid h-[650px] w-full grid-cols-[40%_60%] overflow-hidden bg-[#080808]">
      <div className="relative overflow-hidden">
        <img
          src={sct1Bg}
          alt=""
          className="absolute inset-0 h-full w-full scale-[2.3] object-cover object-[-180%_45%]"
        />

        <div className="absolute inset-0 bg-[#3c3c3c]/75" />
        <div className="absolute inset-0 bg-[#000]/10" />

        <div className="relative z-10 flex h-full flex-col justify-center items-end pr-[100px] pl-[150px] text-[#fafafa]">
          <h2 className="font-['Forum'] text-[60px] leading-[1]">
            VIEWING MODE
          </h2>

          <p className="mt-[14px] whitespace-nowrap text-[24px] font-light text-[#fafafa]/60">
            아트룸의 감상모드를 소개합니다
          </p>

          <Link
            to="/viewing"
            className="mt-[30px] flex w-fit items-center gap-[12px] bg-white/20 px-[28px] py-[14px] text-[22px] font-light text-[#fafafa] backdrop-blur-[2px] transition-all duration-300 hover:bg-white/30 hover:scale-105 rounded-[8px]"
          >
            감상모드
            <Play size={22} strokeWidth={1.3} />
          </Link>
        </div>
      </div>

      <div className="relative flex items-center justify-center bg-[#080808] cursor-pointer">
        <div className="flex flex-col items-center text-center text-[#fafafa]">
          <p className="text-[24px] font-light leading-[1.45]">
            미술관을 직접 방문하지 않아도
            <br />
            깊이있는 감상이 가능한 감상모드를 즐겨보세요
          </p>

          <img
            src={tapIcon}
            alt="클릭 아이콘"
            className="hover:scale-105 mt-[22px] w-[42px] animate-[tapFade_2.2s_ease-in-out_infinite]"
          />
        </div>
      </div>
    </section>
  );
}
