'use client';

import { useState } from 'react';

import { VapeType } from '@/app/api/models/vape';
import Product from './product';
import AlertMsg, { OpenAlertType } from '@/components/alertMsg';

export default function ProductsGrid({
  vapeData,
  gridCols = 'grid-cols-4',
}: {
  vapeData: VapeType[];
  gridCols?: string;
}) {
  const [openAlert, setOpenAlert] = useState<OpenAlertType>({
    open: false,
    msg: '',
    severity: 'success',
  });

  return vapeData.length ? (
    <>
      <div className="fixed">
        <AlertMsg openAlert={openAlert} setOpenAlert={setOpenAlert} />
      </div>
      <div className={`mt-12 grid ${gridCols} gap-8 w-full`}>
        {vapeData.map((val, i) => (
          <Product key={i} product={val} setOpenAlert={setOpenAlert} />
        ))}
      </div>
    </>
  ) : (
    <h3 className="mt-10 mx-auto text-center text-secudary font-medium text-2xl">
      Nenhum resultado encontrado
    </h3>
  );
}
