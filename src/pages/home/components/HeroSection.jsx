import { ChevronDown, Mouse } from "lucide-react";
import GirlImg from "../../../img/homeImg/girl.png";

export default function HeroSection() {
  return (
    <section className="relative h-[100vh] pt-[80px] overflow-hidden bg-[#303030] px-[150px]">
      <div className="relative z-10 flex h-full items-center">
        <div className="pb-[40px]">
          <h1 className="font-['Forum'] text-[250px] leading-[200px] tracking-[-0.05em] text-[#7A2431]">
            A ROOM
            <br />
            FOR ART.
          </h1>

          <p className="mt-[22px] text-[26px] font-light text-[#FAFAFA]/70">
            일상 속에서 자유롭게 작품을 발견하고 감상해보세요
          </p>
        </div>
      </div>

      <img
        src={GirlImg}
        alt="진주 귀걸이를 한 소녀"
        className="absolute bottom-[-30PX] right-[60px] z-[5] h-[103%] w-auto object-contain"
      />

      <p className="absolute bottom-[20px] right-[625px] z-10 text-[18px] text-white/25">
        진주귀걸이를 한 소녀
      </p>

      <div className="absolute bottom-[55px] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-[6px]">
        <Mouse
          size={32}
          strokeWidth={0.5}
          className="text-white/40 animate-[arrowFade_1.8s_ease-in-out_infinite]"
        />

        <div className="flex flex-col items-center -space-y-[5px] animate-[arrowFade_1.8s_ease-in-out_infinite]">
          <ChevronDown size={24} strokeWidth={1} className="text-white/35" />
          <ChevronDown size={24} strokeWidth={1} className="text-white/20" />
        </div>
      </div>
    </section>
  );
}
