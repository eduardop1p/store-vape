import Link from 'next/link';
import dynamic from 'next/dynamic';

import Logo from '../logo';
import Search from './search';
import Tracking from './tracking';
import MyAccount from './myAccount';
import Links from './links';
import { FaShoppingCart } from 'react-icons/fa';
const Cart = dynamic(() => import('./cart'), {
  ssr: false,
  loading: () => (
    <div
      className={`bg-primary rounded-3xl px-8 h-[50px] flex items-center justify-center flex-none`} // eslint-disable-line
    >
      <FaShoppingCart fill="#3d3d3d" size={16} className="flex-none" />
    </div>
  ),
});

export default function Header() {
  return (
    <header className="bg-3d3d3d w-full px-12 py-2 flex flex-col items-center fixed top-0 left-0 z-10">
      <div className="w-[80%] flex justify-between gap-4 items-center">
        <Link className="flex gap-1 items-center" href="/">
          <div className="flex flex-col gap-1 items-center">
            <div className="flex-none w-20 h-20 rounded-full flex items-center justify-center border-2 border-solid border-blue-400">
              <Logo />
            </div>
            <h2 className="text-primary font-normal text-sm">KING VAPES</h2>
          </div>
        </Link>
        <Search />
        <Tracking />
        <MyAccount />
        <Cart />
      </div>
      <Links />
    </header>
  );
}
