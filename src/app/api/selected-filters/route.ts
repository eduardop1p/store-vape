/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import vapeModel from '../models/vape';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const name = searchParams.get('name');
    const category = searchParams.get('category');
    const price = searchParams.get('price');
    const priceType = searchParams.get('priceType');
    const mark = searchParams.get('mark');
    const status = searchParams.get('status');
    const flavors = searchParams.get('flavors');
    const colors = searchParams.get('colors');
    const ohm = searchParams.get('ohm');
    const nicotina = searchParams.get('nicotina');
    const ml = searchParams.get('ml');
    const qtdItems = searchParams.get('qtdItems');
    const withBattery = searchParams.get('withBattery');

    let classify = searchParams.get('classify');
    let sort = {};
    if (classify == 'name') sort = { name: 1 };
    if (classify == 'price-lte') sort = { price: 1 };
    if (classify == 'price-gte') sort = { price: -1 };
    if (classify == 'buy') sort = { qtdIBuyItems: -1 };
    if (classify == 'launch') sort = { createdIn: -1 };
    if (classify == 'relevance') sort = { relevance: -1 };

    if (!searchParams.size || (classify && searchParams.size === 1)) {
      return NextResponse.json({
        success: true,
        data: await vapeModel.find().sort(sort),
      });
    }

    let priceQuery = () => {
      if (priceType == 'lte' && price) return { $lte: +price };
      if (priceType == 'gte' && price) return { $gte: +price };
      if (priceType == 'gte-lte' && price) {
        const arrPrice = price.split(',').map(val => +val);
        return { $gte: arrPrice[0], $lte: arrPrice[1] };
      }
      return { $exists: true };
    };

    let findFilters = await vapeModel
      .find({
        $and: [
          { name: name ? new RegExp('^' + name, 'i') : { $exists: true } },
          {
            category: category
              ? { $in: category.split(',') }
              : { $exists: true },
          },
          { price: priceQuery() },
          { mark: mark ? { $in: mark.split(',') } : { $exists: true } },
          { status: status ? status : { $exists: true } },
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
            nicotina: nicotina
              ? { $in: nicotina.split(',') }
              : { $exists: true },
          },
          {
            ml: ml ? { $in: ml.split(',') } : { $exists: true },
          },
          {
            qtdItems: qtdItems
              ? { $in: qtdItems.split(',') }
              : { $exists: true },
          },
          {
            withBattery: withBattery ? withBattery : { $exists: true },
          },
        ],
      })
      .sort(sort);

    return NextResponse.json({
      success: true,
      data: findFilters,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: 'Erro ao filtrar produtos',
      },
      {
        status: 400,
      }
    );
  }
}
