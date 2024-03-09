import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cep = req.nextUrl.searchParams.get('cep')?.replaceAll('-', '');

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      method: 'GET',
    });
    const data = await res.json();
    if (!res.ok || 'erro' in data) throw new Error('error');

    const newDate = { city: data.localidade, uf: data.uf, country: 'Brasil' };
    return NextResponse.json(newDate);
  } catch (err) {
    // console.log(err);
    return NextResponse.json(
      {
        erro: 'Erro ao buscar cep',
      },
      {
        status: 400,
      }
    );
  }
}
