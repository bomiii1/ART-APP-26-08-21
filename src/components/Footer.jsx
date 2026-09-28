export default function Footer() {
  return (
    <footer className="bg-[#3c3c3c] text-[#fafafa]">
      <div className="mx-auto px-[16px] py-[60px] sm:px-[40px] md:px-[60px] lg:px-[150px] lg:py-[80px]">
        <div>
          <h2 className="font-['Forum'] text-[22px] sm:text-[24px]">ARTROOM</h2>

          <p className="mt-[8px] text-[12px] font-light leading-[1.7] text-white/75 sm:text-[13px]">
            일상 속에서 다양한 작품을 발견하고 자유롭게 감상할 수 있는 온라인
            아트 공간.
          </p>
        </div>

        <div className="mt-[30px] text-[12px] font-light leading-[1.7] text-white/75 sm:text-[13px]">
          <p>bombom@artroom.kr</p>
          <p>서울특별시 성동구 성수이로 00</p>
          <p>02-1234-5678</p>
        </div>

        <div className="mt-[45px] border-t border-white/30 pt-[16px]">
          <p className="text-[11px] font-light text-white/60 sm:text-[12px]">
            © 2026 ARTROOM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
