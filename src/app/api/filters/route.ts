/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

import vapeModel from '../models/vape';

interface FiltersValueType {
  value?: string;
  checked: boolean;
}

export interface FiltersDbType {
  category: FiltersValueType[];
  mark: FiltersValueType[];
  flavors: FiltersValueType[];
  colors: FiltersValueType[];
  ohm: FiltersValueType[];
  nicotina: FiltersValueType[];
  ml: FiltersValueType[];
  qtdItems: FiltersValueType[];
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();

    const category = await vapeModel.distinct('category');
    const mark = await vapeModel.distinct('mark');
    const flavors = await vapeModel.distinct('flavors');
    const colors = await vapeModel.distinct('colors');
    const ohm = await vapeModel.distinct('ohm');
    const nicotina = await vapeModel.distinct('nicotina');
    const ml = await vapeModel.distinct('ml');
    const qtdItems = await vapeModel.distinct('qtdItems');

    const filters: FiltersDbType = {
      category: category.map(val => ({
        value: val,
        checked: false,
      })),
      mark: mark.map(val => ({
        value: val,
        checked: false,
      })),
      flavors: flavors.map(val => ({
        value: val,
        checked: false,
      })),
      colors: colors.map(val => ({
        value: val,
        checked: false,
      })),
      ohm: ohm.map(val => ({
        value: val,
        checked: false,
      })),
      nicotina: nicotina.map(val => ({
        value: val,
        checked: false,
      })),
      ml: ml.map(val => ({
        value: val,
        checked: false,
      })),
      qtdItems: qtdItems.map(val => ({
        value: val,
        checked: false,
      })),
    };

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
