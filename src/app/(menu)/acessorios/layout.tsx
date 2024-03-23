import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acessórios - King vapes - Pod descartável, vapes e muito mais!',
  // description: "Generated by create next app",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
