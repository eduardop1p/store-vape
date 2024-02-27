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
    const price = +(body.get('price') || 0);
    const descount = +body.get('descount')! || undefined;
    const stock = +(body.get('stock') || 0);
    const status = (body.get('status') || undefined) as string | undefined;
    const category = body.get('category') as string;
    const flavors = body.get('flavors')
      ? String(body.get('flavors')).split(',')
      : undefined;
    const newBody: VapeType = {
      fileNames,
      name,
      mark,
      price,
      descount,
      stock,
      status,
      category,
      flavors,
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
