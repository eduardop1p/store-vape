/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import vapeModel from '../../models/vape';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    await dbConnect();

    const result = await vapeModel.findById(productId);
    if (!result)
      throw new Error('Produto não encontrado', { cause: 'product not found' });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        error: err.message, // eslint-disable-line
        cause: err.cause,
      },
      {
        status: 400,
      }
    );
  }
}
