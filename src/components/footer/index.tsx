import { cookies } from 'next/headers';

import FooterNoAuth from './footerNoAuth';

export default function Footer() {
  const isAuth = cookies().has('auth');

  return isAuth ? null : <FooterNoAuth />;
}
