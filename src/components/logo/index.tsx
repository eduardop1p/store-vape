import Image from 'next/image';

export default function Logo() {
  return (
    <Image
      src="/assets/imgs/logo.png"
      width={90}
      height={90}
      alt="logo"
      className="flex-none"
    />
  );
}
