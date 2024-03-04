'use client';

import { useState } from 'react';

import { VapeType } from '@/app/api/models/vape';
import Product from '../product';
import AlertMsg, { OpenAlertType } from '@/components/alertMsg';

export default function ProductsGrid({ vapeData }: { vapeData: VapeType[] }) {
  const [openAlert, setOpenAlert] = useState<OpenAlertType>({
    open: false,
    msg: '',
    severity: 'success',
  });
  return (
    <>
      <AlertMsg openAlert={openAlert} setOpenAlert={setOpenAlert} />
      <div className="mt-12 grid grid-cols-4 gap-8">
        {vapeData.map((val, i) => (
          <Product key={i} product={val} setOpenAlert={setOpenAlert} />
        ))}
      </div>
    </>
  );
}
