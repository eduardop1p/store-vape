/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

import vapeModel from '../models/vape';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();

    /*
      Para rename o campo antino tem que tá no model, se não, não funciona
      const res = await vapeModel.updateMany(
        {},
        { $rename: { descount: 'productDescount' } }
        );

      const res = await vapeModel.updateMany(
        {},
        {
          $set: { pixPrice: 0 },
        },
        {
          multi: true,
        }
      );
    */

    const vapesData = await vapeModel.find();

    const newVapesData = vapesData.map(val => {
      const finalPrice = val.basePrice * (1 - val.productDescount!);
      const pixPrice = finalPrice * (1 - val.pixDescount!);
      val.finalPrice = +finalPrice.toFixed(2);
      val.pixPrice = +pixPrice.toFixed(2);
      return val;
    });
    for (let i = 0; i < newVapesData.length; i++) {
      const val = newVapesData[i];
      await vapeModel.findByIdAndUpdate(val._id, {
        $set: { finalPrice: val.finalPrice, pixPrice: val.pixPrice },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: 'Erro ao atualizar campo no banco de dados',
      },
      {
        status: 400,
      }
    );
  }
}
