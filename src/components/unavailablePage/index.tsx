export default function UnavailablePage() {
  return (
    // eslint-disable-next-line
    <div className={`bg-primary min-h-screen flex items-center justify-center mt-[200px]`}>
      <div className="flex gap-5 items-center">
        {/* eslint-disable-next-line */}
        <h2 className={`text-black font-medium text-2xl`}>503</h2>
        {/* eslint-disable-next-line */}
        <span className={`h-[49px] w-[1px] bg-00000066`}></span>
        {/* eslint-disable-next-line */}
        <p className={`text-black font-normal text-sm`}>
          This page is temporarily unavailable at this time
        </p>
      </div>
    </div>
  );
}
