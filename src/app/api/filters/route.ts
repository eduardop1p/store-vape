/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

import vapeModel from '../models/vape';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();

    const filters = await vapeModel
      .find()
      .select([
        'category',
        'mark',
        'status',
        'flavors',
        'colors',
        'ohm',
        'nicotina',
        'ml',
        'qtdItems',
      ]);

    return NextResponse.json({
      succes: 200,
      data: filters,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: 'Erro ao fazer busca de filtros',
      },
      {
        status: 400,
      }
    );
  }
}
