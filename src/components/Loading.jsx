export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
      <div className="text-center">
        <h1 className="font-['Forum'] text-[42px] text-[#7A2431] sm:text-[56px]">
          ARTROOM
        </h1>

        <div className="mx-auto mt-[24px] h-[1px] w-[120px] overflow-hidden bg-[#3c3c3c]/15">
          <div className="h-full w-[40%] animate-[loading_1.4s_ease-in-out_infinite] bg-[#7A2431]" />
        </div>

        <p className="mt-[18px] text-[13px] tracking-[0.08em] text-[#3c3c3c]/50">
          작품을 불러오는 중입니다
        </p>
      </div>
    </div>
  );
}
