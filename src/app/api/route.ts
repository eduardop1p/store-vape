export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 200,
    }),
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
