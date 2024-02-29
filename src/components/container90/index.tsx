import { ReactNode } from 'react';

export default function Container90({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-12 py-8 w-[90%] mx-auto flex flex-col ${className}`}>
      {children}
    </div>
  );
}
