/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import vapeModel, { VapeDocumentType } from '../models/vape';
import { notFound } from 'next/navigation';
import { FilterQuery, model } from 'mongoose';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const name = searchParams.get('name');
    const category = searchParams.get('category');
    const subcategory2 = searchParams.get('subcategory2');
    const subcategory3 = searchParams.get('subcategory3');
    let price: string | null | any[] = searchParams.get('price');
    const mark = searchParams.get('mark');
    const status = searchParams.get('status');
    const flavors = searchParams.get('flavors');
    const colors = searchParams.get('colors');
    const ohm = searchParams.get('ohm');
    const nicotina = searchParams.get('nicotina');
    const ml = searchParams.get('ml');
    const qtdItems = searchParams.get('qtdItems');
    const withBattery = searchParams.get('withBattery');
    const page = +searchParams.get('page')!;
    const productDescount = searchParams.get('productDescount');

    const pageLimit = 20;
    const startIndex = (page - 1) * pageLimit;
    const endIndex = page * pageLimit;

    let classify = searchParams.get('classify');
    let sort = {};
    if (classify == 'name') sort = { name: 1 };
    if (classify == 'price-lte') sort = { finalPrice: 1 };
    if (classify == 'price-gte') sort = { finalPrice: -1 };
    if (classify == 'buy') sort = { qtdIBuyItems: -1 };
    if (classify == 'launch') sort = { createdIn: -1 };
    if (classify == 'relevance') sort = { relevance: -1 };

    if (!searchParams.size || (classify && searchParams.size === 1)) {
      return NextResponse.json({
        success: true,
        data: await vapeModel.find().sort(sort).limit(20),
      });
    }

    const priceQuery = () => {
      if (typeof price === 'string') price = price ? price.split(',') : [];
      if (!price || !price.length) return [{ finalPrice: { $exists: true } }];
      price = price.map(val => {
        val = val.split('-').map((_v: string) => +_v);
        if (val[0] === 0) return { finalPrice: { $lte: val[1] } };
        if (val[1] === 0) return { finalPrice: { $gte: val[0] } };

        return { finalPrice: { $gte: val[1], $lte: val[0] } };
      });
      return price;
    };

    let nameQuery = name || '';
    let arrNameQuery = nameQuery.split(' ');
    let regexArray = [];
    for (let i = 0; i < arrNameQuery.length; i++) {
      regexArray.push(new RegExp(arrNameQuery[i], 'i'));
    }

    const query = {
      $and: [
        {
          name: name ? { $all: regexArray } : { $exists: true },
        },
        {
          category: category ? { $in: category.split(',') } : { $exists: true },
        },
        {
          subcategory2: subcategory2
            ? { $in: subcategory2.split(',') }
            : { $exists: true },
        },
        {
          subcategory3: subcategory3
            ? { $in: subcategory3.split(',') }
            : { $exists: true },
        },
        { $or: [...priceQuery()] },
        { mark: mark ? { $in: mark.split(',') } : { $exists: true } },
        { status: status ? { $in: status.split(',') } : { $exists: true } },
        {
          flavors: flavors
            ? {
                $in: flavors.split(',').map(val => new RegExp(val, 'i')),
              }
            : { $exists: true },
        },
        {
          colors: colors
            ? {
                $in: colors.split(',').map(val => new RegExp(val, 'i')),
              }
            : { $exists: true },
        },
        {
          ohm: ohm ? { $in: ohm.split(',') } : { $exists: true },
        },
        {
          nicotina: nicotina ? { $in: nicotina.split(',') } : { $exists: true },
        },
        {
          ml: ml ? { $in: ml.split(',') } : { $exists: true },
        },
        {
          qtdItems: qtdItems ? { $in: qtdItems.split(',') } : { $exists: true },
        },
        {
          withBattery: withBattery ? withBattery : { $exists: true },
        },
        { productDescount: productDescount ? { $gt: 0 } : { $exists: true } },
      ],
    } as FilterQuery<VapeDocumentType>;

    if (mark) {
      const existsMark = await vapeModel.findOne({ mark });
      if (!existsMark)
        throw new Error('Marca não existe', {
          cause: 'mark not found',
        });
    }

    const total = await vapeModel.find(query).countDocuments();

    const results = await vapeModel
      .find(query)
      .sort(sort)
      .skip(startIndex)
      .limit(pageLimit);

    return NextResponse.json({
      success: true,
      results,
      currentPage: page,
      totalPages: Math.ceil(total / pageLimit),
      totalResults: total,
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        error: err.cause == 'mark not found' ? err.message :'Erro ao filtrar produtos', // eslint-disable-line
        cause: err.cause,
      },
      {
        status: err.cause == 'mark not found' ? 404 : 400,
      }
    );
  }
}
