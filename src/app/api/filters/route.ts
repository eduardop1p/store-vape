/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

import vapeModel from '../models/vape';

interface FiltersValueType {
  value?: string;
  querys: {
    value: string;
    query?: string;
  };
  checked: boolean;
  default?: boolean;
}

export interface FiltersDbType {
  category: FiltersValueType[];
  subcategory2: FiltersValueType[];
  subcategory3: FiltersValueType[];
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
    const subcategory2 = await vapeModel.distinct('subcategory2');
    const subcategory3 = await vapeModel.distinct('subcategory3');

    const mark = await vapeModel.distinct('mark');
    const flavors = await vapeModel.distinct('flavors');
    const colors = await vapeModel.distinct('colors');
    const ohm = await vapeModel.distinct('ohm');
    const nicotina = await vapeModel.distinct('nicotina');
    const ml = await vapeModel.distinct('ml');
    const qtdItems = await vapeModel.distinct('qtdItems');

    const results: FiltersDbType = {
      category: category.map(val => ({
        value: val,
        checked: false,
        querys: {
          value: 'category',
          query: val,
        },
      })),
      subcategory2: subcategory2.map(val => ({
        value: val,
        checked: false,
        querys: {
          value: 'subcategory2',
          query: val,
        },
      })),
      subcategory3: subcategory3.map(val => ({
        value: val,
        checked: false,
        querys: {
          value: 'subcategory3',
          query: val,
        },
      })),
      mark: mark.map(val => ({
        value: val,
        checked: false,
        querys: {
          value: 'mark',
          query: val,
        },
      })),
      flavors: flavors.map(val => ({
        value: val,
        checked: false,
        querys: {
          value: 'flavors',
          query: val,
        },
      })),
      colors: colors.map(val => ({
        value: val,
        checked: false,
        querys: {
          value: 'colors',
          query: val,
        },
      })),
      ohm: ohm.map(val => ({
        value: val,
        checked: false,
        querys: {
          value: 'ohm',
          query: val,
        },
      })),
      nicotina: nicotina.map(val => ({
        value: val,
        checked: false,
        querys: {
          value: 'nicotina',
          query: val,
        },
      })),
      ml: ml.map(val => ({
        value: val,
        checked: false,
        querys: {
          value: 'ml',
          query: val,
        },
      })),
      qtdItems: qtdItems.map(val => ({
        value: val,
        checked: false,
        querys: {
          value: 'qtdItems',
          query: val,
        },
      })),
    };

    return NextResponse.json({
      succes: 200,
      results,
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
