export default function ErrorMsg({ msg }: { msg?: string }) {
  return (
    <div className="ml-[10px] mt-[2px] text-[11px] font-normal text-red-600">
      {msg}
    </div>
  );
}
