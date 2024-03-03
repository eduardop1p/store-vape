/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import vapeModel from '../../models/vape';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await dbConnect();

    const product = await vapeModel.findById(id).select(['qtdIBuyItems']);

    if (!product) throw new Error('Error');

    if (product.qtdIBuyItems) {
      product.qtdIBuyItems++;
    } else {
      product.qtdIBuyItems = 1;
    }
    await product.save();

    return NextResponse.json({
      success: 'Produto adcionado aos mais vendidos',
      qtdIBuyItems: product.qtdIBuyItems,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Erro ao adcionar produto aos mais vendidos',
      },
      {
        status: 400,
      }
    );
  }
}
