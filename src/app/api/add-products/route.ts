/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

import vapeModel, { VapeType } from '../models/vape';
import dbConnect from '@/lib/dbConnect';

const setFileName = (name: string) =>
  `${crypto.randomUUID()}${path.extname(name)}`;

const removeFiles = async (fileNames: string[]) => {
  for (const fileName of fileNames) {
    await unlink(path.join(process.cwd(), `/public/uploads/imgs/${fileName}`));
  }
};

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.formData();
  const files = body.getAll('productFiles') as File[];
  const fileNames: string[] = [];

  try {
    const buffers = files.map(async (file: File, index) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fName = setFileName(files[index].name);
      await writeFile(
        path.join(process.cwd(), `/public/uploads/imgs/${fName}`),
        buffer
      );
      return fName;
    });

    const resolvedFnames = await Promise.all(buffers);
    fileNames.push(...resolvedFnames);
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Ocorreu um erro ao fazer upload de imagens',
      },
      { status: 400 }
    );
  }

  try {
    const name = body.get('name') as string;
    const mark = body.get('mark') as string;
    const basePrice = +body.get('basePrice')!;
    const finalPrice = +body.get('finalPrice')!;
    const pixPrice = +body.get('pixPrice')!;
    let productDescount = JSON.parse(body.get('productDescount') as string);
    let pixDescount = JSON.parse(body.get('pixDescount') as string);
    const stock = +body.get('stock')!;
    let status = JSON.parse(body.get('status') as string);
    // status = status ? status : undefined;

    const category = body.get('category') as string;
    const subcategory2 = body.get('subcategory2') as string;
    const subcategory3 = body.get('subcategory3') as string;

    const flavors = JSON.parse(body.get('flavors') as string);
    const colors = JSON.parse(body.get('colors') as string);
    const withBattery = JSON.parse(body.get('withBattery') as string);
    let ohm = JSON.parse(body.get('ohm') as string);
    // ohm = ohm ? ohm : undefined;
    let nicotina = JSON.parse(body.get('nicotina') as string);
    // nicotina = nicotina ? nicotina : undefined;
    let ml = JSON.parse(body.get('ml') as string);
    // ml = ml ? ml : undefined;
    let qtdItems = JSON.parse(body.get('qtdItems') as string);
    // qtdItems = qtdItems ? qtdItems : undefined;
    const newBody: VapeType = {
      fileNames,
      name,
      mark,
      basePrice,
      finalPrice,
      pixPrice,
      productDescount,
      pixDescount,
      stock,
      status,
      category,
      subcategory2,
      subcategory3,
      flavors,
      colors,
      withBattery,
      ohm,
      nicotina,
      ml,
      qtdItems,
    };

    await dbConnect();

    await vapeModel.create(newBody);

    return NextResponse.json({
      success: 'Produto foi adcionado com sucesso!',
    });
  } catch (err) {
    console.log(err);
    await removeFiles(fileNames);
    return NextResponse.json(
      {
        error: 'Erro ao adcionar produto, tente novalmente',
      },
      {
        status: 400,
      }
    );
  }
}
