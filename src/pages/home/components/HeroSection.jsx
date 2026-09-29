import { ChevronDown, Mouse } from "lucide-react";
import GirlImg from "../../../img/homeImg/girl.png";

export default function HeroSection() {
  return (
    <section className="relative h-dvh min-h-[650px] overflow-hidden bg-[#303030] px-[16px] pt-[80px] sm:px-[40px] lg:min-h-[750px] lg:px-[150px]">
      <div className="relative z-10 flex h-full items-start pt-[45px] sm:items-center sm:pt-0">
        <div className="sm:pb-[80px] lg:pb-[40px]">
          <h1 className="font-['Forum'] text-[80px] leading-[0.82] tracking-[-0.05em] text-[#7A2431] sm:text-[110px] md:text-[160px] lg:text-[140px] xl:text-[170px] 2xl:text-[250px] lg:leading-[200px]">
            A ROOM
            <br />
            FOR ART.
          </h1>

          <p className="mt-[16px] max-w-[250px] text-[16px] font-light leading-[1.5] text-[#FAFAFA]/70 sm:mt-[18px] sm:max-w-[420px] sm:text-[18px] lg:mt-[22px] lg:max-w-none lg:text-[26px]">
            일상 속에서 자유롭게
            <br className="sm:hidden" />
            작품을 발견하고 감상해보세요
          </p>
        </div>
      </div>

      <img
        src={GirlImg}
        alt="진주 귀걸이를 한 소녀"
        className="absolute bottom-[-30px] right-[-25px] z-[5] h-[55%] w-auto object-contain sm:right-[10px] sm:h-[68%] lg:bottom-[-30px] lg:right-[60px] lg:h-[103%]"
      />

      <p className="absolute bottom-[18px] right-[16px] z-10 text-[14px] text-white/35 sm:bottom-[22px] sm:right-[40px] lg:bottom-[20px] lg:right-[625px] lg:text-[18px]">
        진주귀걸이를 한 소녀
      </p>

      <div className="absolute bottom-[28px] left-[18px] z-20 flex flex-col items-center sm:bottom-[38px] sm:left-[40px] lg:bottom-[55px] lg:left-1/2 lg:-translate-x-1/2">
        <span className="mb-[6px] text-[14px] tracking-[0.18em] text-white/35 lg:hidden">
          SCROLL
        </span>

        <Mouse
          size={32}
          strokeWidth={0.5}
          className="hidden animate-[arrowFade_1.8s_ease-in-out_infinite] text-white/40 lg:block"
        />

        <div className="flex animate-[arrowFade_1.8s_ease-in-out_infinite] flex-col items-center -space-y-[5px]">
          <ChevronDown
            size={22}
            strokeWidth={1}
            className="text-white/40 lg:size-[24px]"
          />

          <ChevronDown
            size={22}
            strokeWidth={1}
            className="text-white/20 lg:size-[24px]"
          />
        </div>
      </div>
    </section>
  );
}
