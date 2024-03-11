export default async function getCep(cep: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/get-cep?cep=${cep}`,
      {
        method: 'GET',
        cache: 'no-cache',
      }
    );
    if (!res.ok) throw new Error('error');
    const data = await res.json();

    return {
      err: null,
      city: data.city as string,
      uf: data.uf as string,
    };
  } catch (err) {
    return {
      err: 'CEP inválido',
      city: '',
      uf: '',
    };
  }
}
