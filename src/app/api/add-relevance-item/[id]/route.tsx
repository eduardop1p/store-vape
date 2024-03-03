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

    const product = await vapeModel.findById(id).select(['relevance']);

    if (!product) throw new Error('Error');

    if (product.relevance) {
      product.relevance++;
    } else {
      product.relevance = 1;
    }
    await product.save();

    return NextResponse.json({
      success: 'Produto relevante',
      relevance: product.relevance,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Erro produto inrrelevante',
      },
      {
        status: 400,
      }
    );
  }
}
