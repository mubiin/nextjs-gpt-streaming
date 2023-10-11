import { OpenAIStream } from '@/utils/OpenAIStream';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const stream = await OpenAIStream({ prompt });
  return new Response(stream, {
    headers: new Headers({
      'Cache-Control': 'no-cache',
    }),
  });
}
